"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError("ایمیل یا رمز عبور نادرست است.");
      setLoading(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="w-full space-y-3">
      <input
        type="email"
        className="field"
        placeholder="ایمیل"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        dir="ltr"
        required
        autoComplete="email"
      />
      <input
        type="password"
        className="field"
        placeholder="رمز عبور"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        dir="ltr"
        required
        autoComplete="current-password"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-olive py-2.5 font-semibold text-white transition-colors hover:bg-olive-deep disabled:opacity-60"
      >
        {loading ? "در حال ورود…" : "ورود"}
      </button>
    </form>
  );
}
