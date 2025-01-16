import { PlusCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function AdminHome() {
  return (
    <>
      <main className="p-16">
        <div className="flex flex-col items-center">
          <Link
            href="/dashboard/add-match/valorant"
            aria-label="Add Valorant Match"
            className="flex flex-col items-center rounded-lg border-2 border-neutral-500 p-4 text-neutral-500 hover:border-neutral-200 hover:bg-neutral-500 hover:text-neutral-200"
          >
            <span className="text-2xl">Add a Valorant Match</span>
            <PlusCircleIcon className="h-auto w-24" />
          </Link>
        </div>
      </main>
    </>
  );
}
