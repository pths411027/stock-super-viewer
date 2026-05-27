"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useMemo, useState } from "react";

export function GoogleLogoutButton() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <button
      className="rounded-md border px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
      disabled={isLoading}
      onClick={async () => {
        setIsLoading(true);
        try {
          await supabase.auth.signOut();
        } finally {
          setIsLoading(false);
        }
      }}
      type="button"
    >
      登出
    </button>
  );
}
