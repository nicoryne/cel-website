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
      {/* Upper Container */}
      <div className="grid grid-cols-2 items-center rounded-t-md bg-neutral-900 px-6 py-4">
        {/* Time */}
        <div>
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
        </div>
        {/* Team, Logo, Score */}
        <div className="flex flex-row items-center space-x-6 text-base">
          {/* Team A */}
          <div className="flex-start flex min-w-24 flex-row items-center space-x-2">
            <Image
              className="text-[2px]"
              src={series.team_a.logo_url}
              alt="Logo"
              width={40}
              height={40}
            />
            <div className="flex flex-1 items-center justify-center">
              <span>{series.team_a.school_abbrev}</span>
            </div>
          </div>
          {/* Vs and Score */}
          <div className="flex space-x-2">
            <span>{series.team_a_score}</span>
            <span className="text-neutral-400">/</span>
            <span>{series.team_b_score}</span>
          </div>
          {/* Team B */}
          <div className="flex-end flex min-w-24 flex-row items-center space-x-2">
            <div className="flex flex-1 items-center justify-center">
              <span>{series.team_b.school_abbrev}</span>
            </div>
            <Image
              className="text-[2px]"
              src={series.team_b.logo_url}
              alt="Logo"
              width={40}
              height={40}
            />
          </div>
        </div>
      </div>
      {/* Lower Container */}
      <div className="flex flex-row justify-between rounded-b-md bg-[#121212] px-4 py-2 text-xs text-neutral-500">
        <Image
          className="text-[2px]"
          src={series.platform.logo_url}
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
