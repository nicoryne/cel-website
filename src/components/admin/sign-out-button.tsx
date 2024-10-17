'use client';
import { logout } from '@/actions/auth';
import { Button } from '@headlessui/react';

export default function LogoutButton() {
  return (
    <Button
      className="rounded-md bg-[var(--accent-primary)] px-8 py-1 font-bold uppercase text-white hover:bg-[var(--accent-primary-hover)] active:bg-[var(--accent-primary-active)]"
      onClick={() => logout()}
    >
      Logout
    </Button>
  );
}
