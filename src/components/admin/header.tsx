'use client';

import ThemeSwitcher from '@/components/theme-switcher';

export default function AdminHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-40 h-16 min-w-full">
      <div className="flex h-full w-full items-center justify-end px-16">
        <ThemeSwitcher />
      </div>
    </header>
  );
}
