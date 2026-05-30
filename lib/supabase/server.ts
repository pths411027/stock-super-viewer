import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // In Next.js Server Components (layouts/pages), cookies are read-only.
          // Only Route Handlers / Server Actions can write Set-Cookie.
          // For writable cookies, create the client inside the Route Handler with NextResponse.
          void cookiesToSet;
        },
      },
    },
  );
}
