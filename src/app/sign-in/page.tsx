import React from 'react';
import Image from 'next/image';
import cel_logo from '@/../public/logos/cel.webp';
import Link from 'next/link';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Link href="/">
          <Image
            alt="Your Company"
            src={cel_logo}
            className="mx-auto h-16 w-auto"
          />
        </Link>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Admin Dashboard
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
