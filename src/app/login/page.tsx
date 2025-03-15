'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import cel_logo from '@/../public/logos/cel.webp';
import Link from 'next/link';
import { login } from '@/services/auth';
import { motion } from 'framer-motion';
import Loading from '@/components/loading';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      await login(formData);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Link href="/">
          <Image alt="Your Company" src={cel_logo} className="mx-auto h-16 w-auto" />
        </Link>
        <h2 className="mt-10 text-center text-2xl leading-9 tracking-tight">Admin Dashboard</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 py-2.5 text-neutral-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--cel-red)] sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6">
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
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-2.5 text-neutral-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--cel-red)] sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <p className="text-center text-sm text-red-500">{error}</p>
          {isLoading ? (
            <Loading />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <motion.button
                type="button"
                className="w-full rounded-md bg-pale px-8 py-1 font-bold uppercase text-white transition-colors duration-300 ease-in-out hover:bg-chili"
                onClick={handleLogin}
                disabled={isLoading}
              >
                Login
              </motion.button>

              <Link
                href="/"
                className="w-fit text-center text-sm font-semibold leading-6 text-gray-500 transition-colors duration-300 ease-in-out hover:text-yale"
              >
                Go back home
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
