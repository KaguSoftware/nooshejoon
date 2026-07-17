import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { LoginForm } from "./LoginForm";
import { Logo } from "@/components/Logo";

export default async function LoginPage() {
  // Already signed in → go to dashboard.
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/admin");

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center px-6">
      <Logo size={88} />
      <h1 className="mt-4 text-xl font-extrabold text-olive-deep">
        پنل مدیریت نوش‌جان
      </h1>
      <p className="mb-6 text-sm text-muted">برای ورود، ایمیل و رمز عبور را وارد کنید</p>
      <LoginForm />
    </main>
  );
}
