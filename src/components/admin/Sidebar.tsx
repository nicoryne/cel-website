'use client';

import React from 'react';
import Image from 'next/image';
import cel_logo from '@/../public/logos/cel.webp';
import Link from 'next/link';
import {
  TableCellsIcon,
  UserIcon,
  ArrowRightStartOnRectangleIcon
} from '@heroicons/react/24/outline';
import { logout } from '@/api/auth/authApi';

type SidebarLink = {
  text: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const defaultSideLinks: SidebarLink[] = [
  { text: 'Series', href: '/admin/series', icon: TableCellsIcon },
  { text: 'Players', href: '/admin/players', icon: UserIcon }
];

export default function Sidebar() {
  const handleLogout = async () => {
    await logout();
  };
  const [isMaximized, setIsMaximized] = React.useState(false);

  return (
    <aside
      className={`transition-width inset-y-0 left-0 z-50 h-full min-h-screen border-r-2 border-[#212121] bg-[#131313] shadow-md duration-200 ${
        isMaximized ? 'w-16 md:w-48' : 'w-16'
      }`}
      onMouseEnter={() => setIsMaximized(true)}
      onMouseLeave={() => setIsMaximized(false)}
    >
      {/* Wrapper */}
      <nav className="flex h-full min-w-full flex-col place-items-start space-y-4">
        {/* Header */}
        <Link href="/admin" className="ml-3 mt-4 flex place-items-center">
          <Image className="h-auto w-10" src={cel_logo} alt="CEL Logo" />

          <h1
            className={`duration-400 ease ml-2 transform font-semibold text-neutral-300 transition-opacity ${isMaximized ? 'hidden opacity-0 md:block md:opacity-100' : 'hidden opacity-0'}`}
          >
            Dashboard
          </h1>
        </Link>

        {/* Pages Section */}
        <section className="min-w-full border-b-2 border-[#212121] py-4">
          <ul className="space-y-4">
            {defaultSideLinks.map((sideLink, index) => {
              const IconComponent = sideLink.icon;

              return (
                <li
                  key={index}
                  className="rounded-sm px-5 py-2 text-neutral-500 hover:bg-[#191919] hover:text-neutral-300"
                >
                  <Link href={sideLink.href} className="flex items-center">
                    <IconComponent className="h-auto w-6" aria-hidden="true" />

                    <span
                      className={`duration-400 ease ml-2 transform text-xs transition-opacity ${isMaximized ? 'hidden opacity-0 md:block md:opacity-100' : 'hidden opacity-0'}`}
                    >
                      {sideLink.text}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <button
          onClick={handleLogout}
          className="flex min-w-full place-items-center rounded-sm px-5 py-2 text-neutral-500 hover:bg-[#191919] hover:text-neutral-300"
        >
          <ArrowRightStartOnRectangleIcon className="h-auto w-6" />
          <span
            className={`duration-400 ease ml-2 transform text-xs transition-opacity ${isMaximized ? 'hidden opacity-0 md:block md:opacity-100' : 'hidden opacity-0'}`}
          >
            Logout
          </span>
        </button>
      </nav>
    </aside>
  );
}
