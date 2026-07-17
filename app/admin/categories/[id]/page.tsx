import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getCategoryWithItems } from "@/lib/admin-data";
import { pick } from "@/lib/i18n";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ItemList } from "@/components/admin/ItemList";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const category = await getCategoryWithItems(id);
  if (!category) notFound();

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <AdminHeader title={pick(category.title, "fa") || "دسته"} />
      <Link
        href="/admin"
        className="mb-4 inline-block text-sm text-muted hover:text-olive-deep"
      >
        ← بازگشت به دسته‌بندی‌ها
      </Link>
      <ItemList categoryId={category.id} items={category.items} />
    </main>
  );
}
