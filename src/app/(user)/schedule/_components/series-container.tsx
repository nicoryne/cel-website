import { SeriesWithDetails } from '@/lib/types';
import Image from 'next/image';
import cel_logo from '@/../public/logos/cel.webp';

type SeriesContainerProps = {
  series: SeriesWithDetails;
};

export default function SeriesContainer({ series }: SeriesContainerProps) {
  return (
    <div className="rounded-md border-2 border-neutral-200 shadow-lg dark:border-neutral-800">
      {/* Upper Container */}
      <div className="grid h-20 grid-cols-3 rounded-t-md px-4 dark:bg-[#212121]">
        {/* Time */}
        <div className="col-span-1 place-content-center">
          <time className="text-base font-bold md:text-xl">
            {new Date(series.start_time)
              .toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              })
              .replace(' AM', '')
              .replace(' PM', '')}
          </time>
          <span className="text-xs dark:text-neutral-300">
            {new Date(series.start_time).getHours() < 12 ? 'AM' : 'PM'}
          </span>
        </div>

        {/* Team, Logo, Score */}
        <div className="col-span-2 grid grid-flow-col place-items-center space-x-4 md:col-span-1 md:space-x-8">
          {/* Team A */}
          <div className="grid grid-cols-2 place-items-center gap-4">
            <p className="text-nowrap p-1 text-xs font-bold md:text-sm">
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
            <span
              className={`${series.team_a_status === 'Win' ? 'font-bold opacity-100' : 'opacity-40'}`}
            >
              {series.team_a_score}
            </span>
            <span className="text-gray-700">/</span>
            <span
              className={`${series.team_b_status === 'Win' ? 'font-bold opacity-100' : 'opacity-40'}`}
            >
              {series.team_b_score}
            </span>
          </div>

          {/* Team B */}
          <div className="grid grid-cols-2 place-items-center gap-4">
            <Image
              className="h-auto w-8 md:w-12"
              src={series.team_b?.logo_url || cel_logo}
              alt="Logo"
              width={256}
              height={256}
            />
            <p className="text-nowrap p-1 text-xs font-bold md:text-sm">
              {series.team_b?.school_abbrev}
            </p>
          </div>
        </div>
      </div>

      {/* Lower Container */}
      <div className="] flex h-8 flex-row items-center justify-between rounded-b-md bg-foreground p-2 dark:bg-neutral-900">
        {/* Platform Logo */}
        <Image
          className="h-auto w-4"
          src={series.platform?.logo_url || cel_logo}
          alt="Platform Logo"
          width={256}
          height={256}
        />

        {/* League Schedule Information */}
        <span className="text-xs font-semibold text-white dark:text-neutral-400">
          {series.league_schedule?.season_type} {series.league_schedule?.season_number} &nbsp; •
          &nbsp; W{series.week} &nbsp; • &nbsp; {series.league_schedule?.league_stage}
        </span>

        {/* Series Type */}
        <span className="text-xs font-semibold text-white dark:text-neutral-400">
          {series.series_type}
        </span>
      </div>
    </div>
  );
}
