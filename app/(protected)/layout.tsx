import { Footer } from "../_components/Footer";
import { Header } from "../_components/Header";
import { PushNotificationBootstrap } from "../_components/PushNotificationBootstrap";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  console.log(data);
  if (!data.user) {
    redirect("/login");
  }

  return (
    <>
      <PushNotificationBootstrap />
      <Header />
      <div className="relative mx-auto w-full max-w-120 px-2 pb-24">
        {children}
      </div>
      <Footer />
    </>
  );
}
