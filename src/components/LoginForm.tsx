'use client';
import React from 'react';
import Image from 'next/image';
import cel_logo from '@/../public/logos/cel.webp';
import Link from 'next/link';
import { login } from '@/actions/auth';

export default function LoginForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    await login(formData);
  };

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
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="marlonadojr@gmail.com"
                required
                autoComplete="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="block w-full rounded-md border-0 py-2.5 text-neutral-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--accent-primary)] sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••"
                required
                autoComplete="current-password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="block w-full rounded-md border-0 py-2.5 text-neutral-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--accent-primary)] sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="mt-10 flex w-full justify-center rounded-md bg-[var(--accent-primary)] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[var(--accent-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary-active)]"
            >
              Login
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          <Link
            href="/"
            className="font-semibold leading-6 hover:text-[var(--accent-secondary)]"
          >
            Go back home
          </Link>
        </p>
      </div>
    </div>
  );
}
