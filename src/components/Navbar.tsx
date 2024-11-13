'use client';
import React from 'react';
import Image from 'next/image';
import cel_logo from '@/../public/logos/cel.webp';
import Link from 'next/link';
import { Bars4Icon } from '@heroicons/react/20/solid';

export type NavigationLink = {
  text: string;
  href: string;
};

const defaultNavLinks: NavigationLink[] = [
  { text: 'Statistics', href: '/statistics' },
  { text: 'Standing', href: '/standing' }
];

export default function Navbar() {
  // Toggle use state for mobile menu bar
  const [menuState, toggleMenu] = React.useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-24 min-w-full">
      {/* Wrapper */}
      <section className="mx-auto flex h-full place-items-center justify-between gap-16 bg-[var(--background)] p-8 md:w-[1100px] md:justify-normal">
        {/* Logo */}
        <Link href="/">
          <Image className="h-auto w-12" src={cel_logo} alt="CEL Logo" />
        </Link>

        {/* Desktop: Navigation Links */}
        <nav className="hidden md:block">
          <ul className="flex gap-8">
            {defaultNavLinks.map((navLink, index) => (
              <li key={index}>
                <Link
                  className="text-base font-medium uppercase hover:text-[var(--accent-secondary)]"
                  href={navLink.href}
                >
                  {navLink.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile: Menu Icon */}
        <Bars4Icon
          className="h-auto w-8 cursor-pointer md:hidden"
          onClick={() => toggleMenu(!menuState)}
        />

        {/* Mobile: Dropdown Menu */}
        {menuState && (
          <nav className="absolute left-0 top-full w-full bg-[var(--background)] md:hidden">
            <ul className="flex flex-col place-items-center gap-8 p-8">
              {defaultNavLinks.map((navLink, index) => (
                <li key={index}>
                  <Link
                    className="text-base font-medium uppercase hover:text-[var(--accent-secondary)]"
                    href={navLink.href}
                    onClick={() => toggleMenu(false)}
                  >
                    {navLink.text}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </section>
    </header>
  );
}
