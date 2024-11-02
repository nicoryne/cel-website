import AdminHeader from '@/components/admin/AdminHeader';
import Sidebar from '@/components/admin/Sidebar';

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
