'use client';

import { useState, useEffect, useMemo } from 'react';
import { defaultNavLinks } from '@/components/navlink';
import Image from 'next/image';
import cel_logo from '@/../public/logos/cel.webp';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars4Icon } from '@heroicons/react/20/solid';
import ThemeSwitcher from '@/components/theme-switcher';

export default function Navbar() {
  const pathname = usePathname();

  const isLanding = pathname == '/';

  const [isMobileMenuOpen, toggleMobileMenu] = useState(false);
  const [isScrolling, setScrolling] = useState(false);

  useEffect(() => {
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

  const isColored = useMemo(() => !isLanding || isScrolling, [isLanding, isScrolling]);

  return (
    <header
      className={`ease fixed inset-x-0 top-0 z-50 h-20 min-w-full text-white transition-colors duration-300 ${isColored ? 'bg-neutral-900' : `bg-transparent`}`}
    >
      {/* Wrapper */}
      <div className="mx-auto flex h-full items-center justify-between p-8 md:w-[700px] lg:w-[900px] xl:w-[1100px]">
        {/* Logo */}
        <Link href="/" aria-label="Go to homepage">
          <Image className="h-auto w-12" src={cel_logo} alt="CEL Logo" priority width={64} height={64} />
        </Link>
        {/* End of Logo */}

        <div className="flex gap-8">
          {/* Desktop Navigation Links */}
          <nav className="hidden md:block" aria-label="Desktop navigation">
            <ul className="flex md:gap-1 lg:gap-6">
              {defaultNavLinks.map((navLink, index) => (
                <li key={index}>
                  <Link
                    className="rounded-x-md rounded-t-md border-b-2 border-transparent px-2 py-1 font-medium duration-150 ease-linear hover:border-chili md:text-sm lg:text-base"
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
            className="h-auto w-8 cursor-pointer md:hidden"
            onClick={() => toggleMobileMenu(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          />
          {/* End of Mobile Menu Icon */}

          <ThemeSwitcher />
        </div>
        {/* Mobile Dropdown Menu */}
        <nav
          className={`fixed inset-0 -z-10 w-full pt-24 transition-all duration-300 md:hidden ${
            isMobileMenuOpen ? 'bg-background opacity-100' : 'pointer-events-none bg-transparent opacity-0'
          }`}
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col items-center gap-16 p-8">
            {defaultNavLinks.map((navLink, index) => (
              <li key={index}>
                <Link
                  className="text-2xl font-medium"
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
