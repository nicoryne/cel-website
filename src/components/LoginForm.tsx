'use client';
import React from 'react';
import { login } from '@/api/auth/authApi';
import PrimaryButton from '@/components/PrimaryButton';
import Link from 'next/link';

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
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6">
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

      <PrimaryButton onClick={(e) => handleLogin(e as any)}>
        Login
      </PrimaryButton>

      <p className="mt-10 text-center text-sm text-gray-500">
        <Link
          href="/"
          className="font-semibold leading-6 hover:text-[var(--accent-secondary)]"
        >
          Go back home
        </Link>
      </p>
    </form>
  );
}
