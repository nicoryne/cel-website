'use client';
import React from 'react';
import { login } from '@/api/auth';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    await login(formData);
  };

  return (
    <form className="space-y-8">
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
            className="block w-full rounded-md border-0 py-2.5 text-neutral-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--cel-red)] sm:text-sm sm:leading-6"
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
            className="block w-full rounded-md border-0 py-2.5 text-neutral-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--cel-red)] sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <motion.button
          type="button"
          className="w-full rounded-md bg-[var(--cel-red)] px-8 py-1 font-bold uppercase text-white"
          onClick={(e) => handleLogin(e as any)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Login
        </motion.button>

        <Link
          href="/"
          className="w-fit text-center text-sm font-semibold leading-6 text-gray-500 hover:text-[var(--cel-blue)]"
        >
          Go back home
        </Link>
      </div>
    </form>
  );
}
