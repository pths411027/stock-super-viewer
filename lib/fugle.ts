import "server-only";

function getFugleApiKey() {
  const key = process.env.FUGLE_API_KEY;
  if (!key) throw new Error("Missing FUGLE_API_KEY");
  return key;
}

export function fugleUrl(path: string) {
  return `https://api.fugle.tw/marketdata/v1.0/${path}`;
}

export function fugleUrlWithQuery(
  path: string,
  query?: Record<string, string | number | boolean | null | undefined>,
) {
  const url = new URL(fugleUrl(path));
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === null || v === undefined) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

export function fugleFetchInit(init?: RequestInit): RequestInit {
  return {
    ...init,
    method: init?.method ?? "GET",
    cache: "no-store",
    headers: {
      "X-API-KEY": getFugleApiKey(),
      ...(init?.headers ?? {}),
    },
  };
}

type FugleCacheMode = "no-store" | "force-cache";
type FugleRevalidate = false | number;

export async function fugleHandler<T>(
  path: string,
  query?: Record<string, string | number | boolean | null | undefined>,
  opts?: { cache?: FugleCacheMode; revalidate?: FugleRevalidate },
): Promise<T> {
  const res = await fetch(fugleUrlWithQuery(path, query), {
    ...fugleFetchInit(),
    cache: opts?.cache ?? "no-store",
    next:
      opts?.revalidate === undefined
        ? undefined
        : { revalidate: opts.revalidate },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `Fugle error: ${res.status}`);
  return JSON.parse(text) as T;
}
