'use client';

import { useState, useEffect, useMemo } from 'react';
import { defaultNavLinks } from '@/components/navlink';
import Image from 'next/image';
import cel_logo from '@/../public/logos/cel.webp';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars4Icon } from '@heroicons/react/20/solid';
import ThemeSwitcher from '@/components/theme-switcher';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { defaultSocials } from './footer';

export default function Navbar() {
  const currentYear = new Date().getFullYear();
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
      className={`ease fixed inset-x-0 top-0 z-50 h-20 min-w-full text-white transition-colors duration-300 ${isColored || isMobileMenuOpen ? 'bg-neutral-900' : `bg-transparent`}`}
    >
      {/* Wrapper */}
      <div className="mx-auto flex h-full items-center justify-between p-8 md:w-[700px] lg:w-[900px] xl:w-[1100px]">
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
          <button
            onClick={() => toggleMobileMenu(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            className="md:hidden"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-auto w-8" />
            ) : (
              <Bars4Icon className="h-auto w-8" />
            )}
          </button>
          {/* End of Mobile Menu Icon */}

          <ThemeSwitcher />
        </div>
        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              className="fixed inset-0 top-20 -z-10 w-full bg-background transition-colors duration-300 dark:bg-neutral-900 md:hidden"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <ul className="flex flex-col items-center gap-16 p-8 text-foreground">
                {defaultNavLinks.map((navLink, index) => (
                  <li key={index} className="w-full border-b">
                    <Link
                      className="text-xl font-medium"
                      href={navLink.href}
                      onClick={() => toggleMobileMenu(false)}
                      prefetch
                    >
                      {navLink.text}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex w-full flex-col items-center gap-8 border-t-2 border-neutral-300 py-4 dark:border-neutral-800 md:flex-row md:justify-between">
                <section
                  aria-labelledby="social-links"
                  className="flex flex-col items-center gap-4 sm:flex-row md:order-2 md:flex-col lg:flex-row"
                >
                  <h2 id="social-links" className="sr-only">
                    CESAFI Esports League Socials
                  </h2>
                  <span className="text-xs sm:text-sm md:text-xs lg:text-sm">
                    Follow our socials!
                  </span>
                  <ul className="flex gap-4">
                    {defaultSocials.map((social, index) => (
                      <li key={index} className="list-none">
                        <Link
                          className="block rounded-md border-2 p-4 transition-colors duration-150 ease-linear hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 hover:dark:border-neutral-600 hover:dark:bg-neutral-700 active:dark:bg-neutral-900"
                          href={social.href}
                          aria-label={`Follow CESAFI Esports League on ${social.text}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="fill-foreground">{social.logo}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>

                <small className="flex items-center text-center text-xs text-neutral-700 dark:text-neutral-300 md:order-1">
                  &copy; {currentYear} CESAFI Esports League. All Rights Reserved.
                </small>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
        {/* End of Mobile Dropdown Menu */}
      </div>
      {/* End of Wrapper */}
    </header>
  );
}
