import { GoogleLoginButton } from "../_components/GoogleOauth/GoogleLoginButton";
export default function Login() {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4">
      <div className="size-10 rounded-br-2xl bg-[#E8B84A]"></div>
      <div className="mt-4">
        <GoogleLoginButton />
      </div>
    </main>
  );
}
