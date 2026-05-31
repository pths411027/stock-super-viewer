"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useMemo, useState } from "react";

export function GoogleLoginButton() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <button
      className="text-yellow rounded-md border border-[#F5F1E6] px-5 py-2 text-sm font-bold text-[#F5F1E6]"
      disabled={isLoading}
      onClick={async () => {
        setIsLoading(true);
        try {
          await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              // Keep `next` so the server callback can redirect to where the user intended.
              redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(
                "/",
              )}`,
            },
          });
        } finally {
          setIsLoading(false);
        }
      }}
      type="button"
    >
      Google
    </button>
  );
}
