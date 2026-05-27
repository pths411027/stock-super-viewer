// app/_components/UserName.tsx
"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type UserState =
  | { status: "loading" }
  | { status: "signed_out" }
  | { status: "signed_in"; name: string; email?: string; avatar?: string };

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
      const avatar = meta.avatar_url;
      console.log(meta);

      setState({
        status: "signed_in",
        name,
        email: data.user.email ?? undefined,
        avatar,
      });
    }

    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);
  console.log(state.status);
  if (state.status === "loading") return null;
  if (state.status === "signed_out")
    return <div className="text-sm">Not signed in</div>;

  console.log(state.avatar);
  return (
    <div className="text-sm text-white">
      Hi, {state.name}
      <Image src={state.avatar} alt={state.name} width={20} height={20} />
    </div>
  );
}
