export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return Response.json(
      {
        ok: false,
        error: "Missing SUPABASE_URL or SUPABASE_ANON_KEY",
      },
      { status: 500 },
    );
  }

  const healthUrl = `${supabaseUrl.replace(/\/$/, "")}/auth/v1/health`;
  const start = Date.now();

  try {
    const res = await fetch(healthUrl, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      // Avoid caching proxy results for health checks.
      cache: "no-store",
    });

    const latencyMs = Date.now() - start;

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return Response.json(
        {
          ok: false,
          status: res.status,
          latencyMs,
          timestamp: new Date().toISOString(),
          error:
            text || `Supabase health check failed with status ${res.status}`,
        },
        { status: 502 },
      );
    }

    return Response.json({
      ok: true,
      status: res.status,
      latencyMs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const latencyMs = Date.now() - start;
    return Response.json(
      {
        ok: false,
        latencyMs,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}
