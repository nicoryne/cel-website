'use client';
import React from 'react';
import Image from 'next/image';
import cel_logo from '@/../public/logos/cel.webp';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars4Icon } from '@heroicons/react/20/solid';

export type NavigationLink = {
  text: string;
  href: string;
};

export const defaultNavLinks: NavigationLink[] = [
  { text: 'About Us', href: '/#about' },
  { text: 'Contact Us', href: '/#contact' }
];

export default function Navbar() {
  const [isMobileMenuOpen, toggleMobileMenu] = React.useState(false);
  const [isScrolling, setScrolling] = React.useState(false);
  const [isColored, setColored] = React.useState(false);
  const pathname = usePathname();

  let isLanding = pathname == '/';

  React.useEffect(() => {
    // Scrolling Use Effect
    const handleScroll = () => {
      const thresholdY = 50;
      setScrolling(window.scrollY > thresholdY);
    };

    const throttleScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttleScroll);
  }, [setScrolling]);

  React.useEffect(() => {
    if (!isLanding || isScrolling) {
      setColored(true);
    } else {
      setColored(false);
    }
  }, [isLanding, isScrolling]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 min-w-full transition-all duration-300 ease-in-out ${
        isColored ? 'h-20 bg-[var(--cel-navy)]' : `h-24 bg-transparent`
      }`}
    >
      <div className="mx-auto flex h-full items-center justify-between gap-16 p-8 md:w-[700px] lg:w-[1000px]">
        {/* Logo */}
        <Link href="/#home">
          <Image
            className="h-auto w-12"
            src={cel_logo}
            alt="CEL Logo"
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:block">
          <ul className="flex gap-8">
            {defaultNavLinks.map((navLink, index) => (
              <li key={index}>
                <Link
                  className="text-base font-medium text-[var(--text-light)] hover:text-[var(--cel-red)]"
                  href={navLink.href}
                >
                  {navLink.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Icon */}
        <Bars4Icon
          className="h-auto w-8 cursor-pointer fill-[var(--text-light)] md:hidden"
          onClick={() => toggleMobileMenu(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        />

        {/* Mobile Dropdown Menu */}
        <nav
          className={`fixed inset-0 -z-10 w-full pt-24 transition-all duration-300 md:hidden ${
            isMobileMenuOpen
              ? 'bg-[var(--cel-navy)] opacity-100'
              : 'pointer-events-none bg-transparent opacity-0'
          }`}
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col items-center gap-8 p-8">
            {defaultNavLinks.map((navLink, index) => (
              <li key={index}>
                <Link
                  className="text-lg font-medium text-[var(--text-light)] hover:text-[var(--cel-red)]"
                  href={navLink.href}
                  onClick={() => toggleMobileMenu(false)}
                >
                  {navLink.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
