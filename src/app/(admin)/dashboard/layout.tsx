import AdminHeader from '@/components/admin/header';
import Sidebar from '@/components/admin/sidebar';

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <AdminHeader />
      <Sidebar />
      <main className="mt-16 w-full overflow-x-hidden">{children}</main>
    </div>
  );
}
