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
  { text: 'Home', href: '/' },
  { text: 'News', href: '/news' },
  { text: 'Schedule', href: '/schedule' },
  { text: 'Statistics', href: '/statistics' },
  { text: 'Standing', href: '/standing' },
  { text: 'Contact', href: '/contact' }
];

export default function Navbar() {
  const pathname = usePathname();

  const isLanding = pathname == '/';

  const [isMobileMenuOpen, toggleMobileMenu] = React.useState(false);
  const [isScrolling, setScrolling] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const thresholdY = 50;
      setScrolling(window.scrollY > thresholdY);
    };

    const throttleScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttleScroll);

    return () => {
      window.removeEventListener('scroll', throttleScroll);
    };
  }, []);

  const isColored = React.useMemo(
    () => !isLanding || isScrolling,
    [isLanding, isScrolling]
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-20 min-w-full transition-all duration-300 ease-in-out ${
        isColored ? 'bg-[var(--background)]' : `bg-transparent`
      }`}
    >
      {/* Wrapper */}
      <div className="mx-auto flex h-full items-center justify-between gap-16 p-8 md:w-[700px] lg:w-[1000px]">
        {/* Logo */}
        <Link href="/" aria-label="Go to homepage">
          <Image
            className="h-auto w-12"
            src={cel_logo}
            alt="CEL Logo"
            priority
            width={64}
            height={64}
          />
        </Link>
        {/* End of Logo */}

        {/* Desktop Navigation Links */}
        <nav className="hidden md:block" aria-label="Desktop navigation">
          <ul className="flex gap-8">
            {defaultNavLinks.map((navLink, index) => (
              <li key={index}>
                <Link
                  className="font-medium text-[var(--text-light)] duration-150 ease-linear hover:text-[var(--cel-red)] md:text-sm lg:text-base"
                  href={navLink.href}
                  prefetch
                >
                  {navLink.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* End of Desktop Navigation Links */}

        {/* Mobile Menu Icon */}
        <Bars4Icon
          className="h-auto w-8 cursor-pointer fill-[var(--foreground)] md:hidden"
          onClick={() => toggleMobileMenu(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        />
        {/* End of Mobile Menu Icon */}

        {/* Mobile Dropdown Menu */}
        <nav
          className={`fixed inset-0 -z-10 w-full pt-24 transition-all duration-300 md:hidden ${
            isMobileMenuOpen
              ? 'bg-[var(--background)] opacity-100'
              : 'pointer-events-none bg-transparent opacity-0'
          }`}
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col items-center gap-16 p-8">
            {defaultNavLinks.map((navLink, index) => (
              <li key={index}>
                <Link
                  className="text-2xl font-medium text-[var(--text-light)] hover:text-[var(--cel-red)]"
                  href={navLink.href}
                  onClick={() => toggleMobileMenu(false)}
                  prefetch
                >
                  {navLink.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* End of Mobile Dropdown Menu */}
      </div>
      {/* End of Wrapper */}
    </header>
  );
}
