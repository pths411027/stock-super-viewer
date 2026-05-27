"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function AuthCallbackPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Signing you in...");

  useEffect(() => {
    const code = searchParams.get("code");
    const error =
      searchParams.get("error_description") ?? searchParams.get("error");

    async function run() {
      if (error) {
        setMessage(String(error));
        return;
      }

      try {
        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        }

        router.replace("/");
      } catch (e) {
        setMessage(e instanceof Error ? e.message : "Login failed");
      }
    }

    run();
  }, [router, searchParams, supabase]);

  return (
    <main className="p-6">
      <div className="text-sm text-zinc-700">{message}</div>
    </main>
  );
}
