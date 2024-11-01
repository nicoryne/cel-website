'use client';
import Image from 'next/image';
import cel_logo from '@/../public/logos/cel.webp';
import LogoutButton from './LogoutButton';

export default function AdminHeader() {
  return (
    <nav className="sticky top-0 z-50 flex min-w-full items-center justify-center bg-[var(--background)] p-8">
      {/* Inner Nav */}
      <div className="flex w-full items-center xl:w-[50%]">
        {/* Logo and Links */}
        <div className="flex items-center">
          {/* Logo */}
          <a href="/">
            <Image className="h-12 w-12" src={cel_logo} alt="CEL Logo" />
          </a>
        </div>
        <LogoutButton />
      </div>
    </nav>
  );
}
