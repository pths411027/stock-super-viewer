// app/_components/UserName.tsx
"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useEffect, useMemo, useState } from "react";

type UserState =
  | { status: "loading" }
  | { status: "signed_out" }
  | { status: "signed_in"; name: string; email?: string };

export function UserProfile() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [state, setState] = useState<UserState>({ status: "loading" });

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const { data, error } = await supabase.auth.getUser();
      console.log(data);
      if (!isMounted) return;

      if (error || !data.user) {
        setState({ status: "signed_out" });
        return;
      }

      const meta = (data.user.user_metadata ?? {}) as Record<string, unknown>;
      const name =
        (typeof meta.full_name === "string" && meta.full_name) ||
        (typeof meta.name === "string" && meta.name) ||
        data.user.email ||
        "User";

      setState({
        status: "signed_in",
        name,
        email: data.user.email ?? undefined,
      });
    }

    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  if (state.status === "loading") return null;
  if (state.status === "signed_out")
    return <div className="text-sm">Not signed in</div>;

  return <div className="text-sm">Hi, {state.name}</div>;
}
