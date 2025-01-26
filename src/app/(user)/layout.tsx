import Footer from '@/components/footer';
import Navbar from '@/components/navbar';

export default function UserLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
