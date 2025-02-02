'use client';
import { SeasonInfo } from '@/lib/types';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface SeasonItemProps {
  season: SeasonInfo;
}

export default function SeasonItem({ season }: SeasonItemProps) {
  const path = usePathname();

  const match = path?.match(/^\/standings\/([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)/);
  const isSelected =
    match?.[1]?.toLowerCase() === season.season_type.toLowerCase() &&
    match?.[2] === season.season_number.toString();

  return (
    <Link
      href={`/standings/${season.season_type.toLowerCase()}/${season.season_number}/${match?.[3]}/groupstage`}
    >
      <div
        className={`border-b px-4 py-4 opacity-80 hover:bg-neutral-50 hover:opacity-100 active:bg-neutral-100 dark:border-b-neutral-700 dark:opacity-60 hover:dark:bg-neutral-900 active:dark:bg-neutral-950 ${isSelected ? 'border-r-4 border-r-chili' : ''}`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <h4 className="text-lg font-extrabold uppercase">
              {season.season_type} {season.season_number}
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <time className="text-xs font-normal dark:font-thin md:text-sm">
              {new Date(season.start_date).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </time>
            <span>
              <ArrowRightIcon className="h-auto w-4" />
            </span>
            <time className="text-xs font-normal dark:font-thin md:text-sm">
              {new Date(season.end_date).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </time>
          </div>
        </div>
      </div>
    </Link>
  );
}
