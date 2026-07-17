import Link from "next/link";
import { Logo } from "@/components/Logo";

export function AdminHeader({ title }: { title: string }) {
  return (
    <header className="mb-6 flex items-center justify-between gap-3 border-b border-frame/50 pb-4">
      <div className="flex items-center gap-3">
        <Logo size={44} />
        <div>
          <p className="font-extrabold text-olive-deep leading-none">
            پنل مدیریت
          </p>
          <p className="text-sm text-muted">{title}</p>
        </div>
      </div>
      <nav className="flex items-center gap-2">
        <Link
          href="/admin/qr"
          className="rounded-xl bg-card px-3 py-2 text-sm font-semibold text-olive-deep ring-1 ring-frame hover:ring-olive/40"
        >
          کد QR
        </Link>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="rounded-xl px-3 py-2 text-sm font-semibold text-muted hover:text-red-600"
          >
            خروج
          </button>
        </form>
      </nav>
    </header>
  );
}
