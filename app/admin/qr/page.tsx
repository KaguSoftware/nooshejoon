import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { QrPanel } from "@/components/admin/QrPanel";

export const dynamic = "force-dynamic";

export default async function QrPage() {
  await requireUser();
  return (
    <main className="mx-auto max-w-xl px-4 py-6">
      <div className="no-print">
        <AdminHeader title="کد QR منو" />
        <Link
          href="/admin"
          className="mb-4 inline-block text-sm text-muted hover:text-olive-deep"
        >
          ← بازگشت
        </Link>
      </div>
      <QrPanel />
    </main>
  );
}
