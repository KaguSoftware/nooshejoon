import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getItem } from "@/lib/admin-data";
import { pick } from "@/lib/i18n";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ItemEditor } from "@/components/admin/ItemEditor";

export const dynamic = "force-dynamic";

export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const item = await getItem(id);
  if (!item) notFound();

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <AdminHeader title={pick(item.name, "fa") || "آیتم"} />
      <Link
        href={`/admin/categories/${item.category_id}`}
        className="mb-4 inline-block text-sm text-muted hover:text-olive-deep"
      >
        ← بازگشت به دسته
      </Link>
      <ItemEditor item={item} />
    </main>
  );
}
