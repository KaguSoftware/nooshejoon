import { requireUser } from "@/lib/auth";
import { getAllCategories } from "@/lib/admin-data";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CategoryList } from "@/components/admin/CategoryList";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireUser();
  const categories = await getAllCategories();

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <AdminHeader title="دسته‌بندی‌ها و آیتم‌ها" />
      <CategoryList categories={categories} />
    </main>
  );
}
