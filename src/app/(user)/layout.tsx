import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Suspense } from 'react';
import Loading from '@/app/loading';

export default function UserLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />

      <Suspense fallback={<Loading />}>{children}</Suspense>

      <Footer />
    </>
  );
}
