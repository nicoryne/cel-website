import { PlusCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function AdminHome() {
  return (
    <>
      <main className="p-16">
        <div className="flex items-center justify-center gap-8">
          <Link
            href="/dashboard/add-match/valorant"
            aria-label="Add Valorant Match"
            className="flex flex-col items-center rounded-lg p-4 text-neutral-500 hover:border-neutral-200 hover:bg-neutral-500 hover:text-neutral-200"
          >
            <span className="text-2xl">Add Valorant Match</span>
            <PlusCircleIcon className="h-auto w-24" />
          </Link>

          <Link
            href="/dashboard/add-match/mlbb"
            aria-label="Add MLBB Match"
            className="flex flex-col items-center rounded-lg p-4 text-neutral-500 hover:border-neutral-200 hover:bg-neutral-500 hover:text-neutral-200"
          >
            <span className="text-2xl">Add MLBB Match</span>
            <PlusCircleIcon className="h-auto w-24" />
          </Link>
        </div>
      </main>
    </>
  );
}
