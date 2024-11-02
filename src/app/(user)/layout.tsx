import Navbar from '@/components/Navbar';

export default function UserLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="mx-auto my-24 flex min-h-fit flex-col p-8 md:w-[1100px]">
      <Navbar />
      {children}
    </main>
  );
}
