'use client';

import { SeriesWithDetails } from '@/lib/types';
import Image from 'next/image';
import cel_logo from '@/../public/logos/cel.webp';

type SeriesContainerProps = {
  series: SeriesWithDetails;
};
export default function SeriesContainer({ series }: SeriesContainerProps) {
  return (
    <div className="rounded-md border-2 shadow-lg">
      {/* Upper Container */}
      <div className="grid h-20 grid-cols-3 rounded-t-md px-4">
        {/* Time */}
        <div className="col-span-1 place-content-center">
          <time className="text-base md:text-xl">
            {new Date(series.start_time)
              .toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              })
              .replace(' AM', '')
              .replace(' PM', '')}
          </time>
          <span className="text-xs">
            {new Date(series.start_time).getHours() < 12 ? 'AM' : 'PM'}
          </span>
        </div>

        {/* Team, Logo, Score */}
        <div className="col-span-2 grid grid-flow-col place-items-center space-x-4 md:col-span-1 md:space-x-8">
          {/* Team A */}
          <div className="grid grid-cols-2 place-items-center gap-1 md:gap-2">
            <p className="text-nowrap p-1 text-xs font-semibold md:text-sm">
              {series.team_a?.school_abbrev}
            </p>
            <Image
              className="h-auto w-8 md:w-12"
              src={series.team_a?.logo_url || cel_logo}
              alt="Logo"
              width={256}
              height={256}
            />
          </div>

          {/* Vs and Score */}
          <div className="space-x-2 text-base md:space-x-3 md:text-lg">
            <span>{series.team_a_score}</span>
            <span className="text-gray-700">/</span>
            <span>{series.team_b_score}</span>
          </div>

          {/* Team B */}
          <div className="grid grid-cols-2 place-items-center gap-1 md:gap-2">
            <Image
              className="h-auto w-8 md:w-12"
              src={series.team_b?.logo_url || cel_logo}
              alt="Logo"
              width={256}
              height={256}
            />
            <p className="text-nowrap p-1 text-xs font-semibold md:text-sm">
              {series.team_b?.school_abbrev}
            </p>
          </div>
        </div>
      </div>

      {/* Lower Container */}
      <div className="] flex h-8 flex-row items-center justify-between rounded-b-md bg-[var(--cel-white)] p-2 text-xs text-neutral-500">
        <Image
          className="h-auto w-4"
          src={series.platform?.logo_url || cel_logo}
          alt="Platform Logo"
          width={256}
          height={256}
        />

        <div>
          <strong>{series.league_schedule?.league_stage}</strong>
          <span>&nbsp; • &nbsp;</span>
          <strong>Week {series.week}</strong>
        </div>

        <strong>{series.series_type}</strong>
      </div>
    </div>
  );
}
