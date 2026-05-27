"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useMemo, useState } from "react";

export function GoogleLoginButton() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <button
      className="text-yellow rounded-md bg-white px-3 py-2 text-sm font-medium"
      disabled={isLoading}
      onClick={async () => {
        setIsLoading(true);
        try {
          const redirectTo = `${window.location.origin}/auth/callback`;
          await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo },
          });
        } finally {
          setIsLoading(false);
        }
      }}
      type="button"
    >
      登入
    </button>
  );
}
