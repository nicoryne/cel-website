'use client';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { useTheme } from 'next-themes';
export default function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <>
      <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
        {resolvedTheme === 'dark' ? <SunIcon className="h-auto w-6" /> : <MoonIcon className="h-auto w-6" />}
      </button>
    </>
  );
}
