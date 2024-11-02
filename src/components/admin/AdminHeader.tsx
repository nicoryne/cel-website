'use client';
import Image from 'next/image';
import cel_logo from '@/../public/logos/cel.webp';
import PrimaryButton from '@/components/PrimaryButton';
import Link from 'next/link';
import { logout } from '@/api/auth/authApi';

export default function AdminHeader() {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-24 min-w-full">
      {/* Wrapper */}
      <section className="mx-auto flex h-full place-items-center justify-between gap-16 bg-[var(--background)] p-8 md:w-[1100px]">
        {/* Logo */}
        <Link href="/admin">
          <Image className="h-auto w-12" src={cel_logo} alt="CEL Logo" />
        </Link>

        <div>
          <PrimaryButton onClick={handleLogout}>Logout</PrimaryButton>
        </div>
      </section>
    </header>
  );
}
