'use client';
import { logout } from '@/actions/auth';

export default function LogoutButton() {
  return (
    <button
      className="rounded-md bg-[var(--accent-primary)] px-8 py-1 font-bold uppercase text-white hover:bg-[var(--accent-primary-hover)] active:bg-[var(--accent-primary-active)]"
      onClick={() => logout()}
    >
      Logout
    </button>
  );
}
