import { GoogleLoginButton } from "../_components/GoogleOauth/GoogleLoginButton";
export function Login() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold text-white">Login</h1>
      <div className="mt-4">
        <GoogleLoginButton />
      </div>
    </main>
  );
}
