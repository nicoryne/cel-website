'use client';

import React from 'react';
import Image from 'next/image';
import cel_logo from '@/../public/logos/cel.webp';
import Link from 'next/link';
import {
  TableCellsIcon,
  UserIcon,
  ArrowRightStartOnRectangleIcon,
  UsersIcon,
  BoltIcon,
  TvIcon,
  MapIcon,
  CalendarDateRangeIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { logout } from '@/api/auth';

type SidebarLink = {
  text: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const defaultSideLinks: SidebarLink[] = [
  { text: 'Schedule', href: '/dashboard/schedule', icon: CalendarDaysIcon },
  { text: 'Series', href: '/dashboard/series', icon: TableCellsIcon },
  { text: 'Teams', href: '/dashboard/teams', icon: UsersIcon },
  { text: 'Players', href: '/dashboard/players', icon: UserIcon },
  { text: 'Platforms', href: '/dashboard/platforms', icon: TvIcon },
  { text: 'Characters', href: '/dashboard/characters', icon: BoltIcon },
  { text: 'Valorant Maps', href: '/dashboard/maps', icon: MapIcon }
];

export default function Sidebar() {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className="inset-y-0 left-0 z-50 h-full min-h-screen w-60 border-r-2 border-[#212121] bg-[#131313] shadow-md duration-200">
      {/* Wrapper */}
      <nav className="flex h-screen flex-col justify-between py-4">
        {/* Header */}
        <Link href="/dashboard" className="ml-3 mt-4 flex place-items-center">
          <Image className="h-auto w-10" src={cel_logo} alt="CEL Logo" />

          <h1 className="duration-400 ease ml-2 transform font-semibold text-neutral-300">Dashboard</h1>
        </Link>

        {/* Pages Section */}
        <section className="min-w-full border-b-2 border-[#212121] py-8">
          <ul className="space-y-4">
            {defaultSideLinks.map((sideLink, index) => {
              const IconComponent = sideLink.icon;

              return (
                <li key={index} className="rounded-sm px-5 py-2 text-neutral-500 hover:text-neutral-300">
                  <Link href={sideLink.href} className="flex items-center">
                    <IconComponent className="h-auto w-6" aria-hidden="true" />

                    <span className="duration-400 ease ml-2 transform text-xs transition-opacity">{sideLink.text}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <button
          onClick={handleLogout}
          className="mt-auto flex min-w-full place-items-center rounded-sm border-t-2 border-neutral-800 px-6 py-4 text-neutral-500 hover:text-neutral-300"
        >
          <ArrowRightStartOnRectangleIcon className="h-auto w-6" />
          <span className="duration-400 ease ml-2 transform text-xs transition-opacity">Logout</span>
        </button>
      </nav>
    </aside>
  );
}
