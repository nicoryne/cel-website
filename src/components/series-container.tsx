'use client';

import { SeriesWithDetails } from '@/lib/types';
import Image from 'next/image';
import { platform } from 'os';

export default function SeriesContainer({
  series
}: {
  series: SeriesWithDetails;
}) {
  return (
    <div className="drop-shadow-md">
      <div className="flex items-center justify-center rounded-t-md bg-neutral-900 px-6 py-4">
        <div className="text-md grid grid-cols-3 items-center text-base">
          <div className="flex flex-row items-center justify-between space-x-2">
            <Image
              className="text-[2px]"
              src={series.team_a.logo_url}
              alt="Logo"
              width={40}
              height={40}
            />
            <span>{series.team_a.school_abbrev}</span>
          </div>
          <div className="flex justify-center space-x-2">
            <span>{series.team_a_score}</span>
            <strong className="text-neutral-400">/</strong>
            <span>{series.team_b_score}</span>
          </div>
          <div className="flex flex-row items-center justify-between space-x-2">
            <span>{series.team_b.school_abbrev}</span>
            <Image
              className="text-[2px]"
              src={series.team_b.logo_url}
              alt="Logo"
              width={40}
              height={40}
            />
          </div>
        </div>
        {/* <div>
          <time className="text-xl">
            {new Date(series.start_time)
              .toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              })
              .replace(' AM', '')
              .replace(' PM', '')}
            {''}
          </time>
          <span className="text-xs text-neutral-300">
            {new Date(series.start_time).getHours() < 12 ? 'AM' : 'PM'}
          </span>
        </div> */}
      </div>
      <div className="flex flex-row justify-between rounded-b-md bg-[#121212] px-4 py-2 text-xs text-neutral-500">
        <Image
          className="text-[2px]"
          src={
            'https://uqulenyafyepinfweagp.supabase.co/storage/v1/object/public/logos/platforms/valorant.webp'
          }
          alt="Logo"
          width={20}
          height={20}
        />

        <div className="flex flex-row">
          <strong>
            {series.league_schedule.season_type}{' '}
            {series.league_schedule.season_number}
          </strong>
          <span>&nbsp; • &nbsp;</span>
          <strong>{series.league_schedule.league_stage}</strong>
        </div>

        <strong>{series.series_type}</strong>
      </div>
    </div>
  );
}
