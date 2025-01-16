import Image from 'next/image';

import ButtonUpdate from '@/components/admin/buttons/button-update';
import ButtonDelete from '@/components/admin/buttons/button-delete';
import { GamePlatform, LeagueSchedule, SeriesFormType, SeriesWithDetails, Team } from '@/lib/types';
import { handleDelete, handleUpdate } from '@/components/admin/clients/series/utils';
import { ModalProps } from '@/components/modal';
import { CalendarIcon, ClockIcon } from '@heroicons/react/16/solid';

type SeriesCardProps = {
  series: SeriesWithDetails;
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>;
  formData: React.MutableRefObject<SeriesFormType | undefined>;
  platformList: GamePlatform[];
  teamList: Team[];
  leagueScheduleList: LeagueSchedule[];
  setCachedSeries: React.Dispatch<React.SetStateAction<SeriesWithDetails[]>>;
};

export default function SeriesCard({
  series,
  setModalProps,
  formData,
  setCachedSeries,
  platformList,
  teamList,
  leagueScheduleList
}: SeriesCardProps) {
  return (
    <div className="flex flex-col rounded-md border-2 border-neutral-700 bg-neutral-900 shadow-lg">
      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-5 place-items-center">
          {/* Team A */}
          <div
            className={`col-span-2 flex place-items-center justify-center gap-4 ${series.team_a_status == 'Loss' ? 'opacity-40' : 'opacity-100'}`}
          >
            <figure className="flex flex-col place-items-center gap-2">
              <Image
                src={series.team_a?.logo_url!}
                alt={`${series.team_a?.school_abbrev} Logo`}
                width={40}
                height={40}
              />
              <figcaption className="rounded bg-neutral-800 px-4 py-1 text-xs font-semibold text-neutral-300">
                {series.team_a?.school_abbrev}
              </figcaption>
            </figure>
            <span
              className={`text-center font-bold ${series.team_a_status === 'Loss' ? 'text-red-600' : `${series.team_a_status === 'Win' ? 'text-green-600' : 'text-neutral-600'}`}`}
            >
              {series.team_a_score}
            </span>
          </div>
          {/* End of Team A */}

          {/* Middle */}
          <div className="flex h-full flex-col place-items-center gap-3">
            <p className="text-xs font-bold text-neutral-600">{series?.series_type}</p>
            <span className="text-xs font-bold text-neutral-600">vs</span>
          </div>
          {/* End of Middle */}

          {/* Team B */}
          <div
            className={`col-span-2 flex place-items-center justify-center gap-4 ${series.team_b_status === 'Loss' ? 'opacity-40' : 'opacity-100'}`}
          >
            <span
              className={`text-center font-bold ${series.team_b_status === 'Loss' ? 'text-red-600' : `${series.team_b_status === 'Win' ? 'text-green-600' : 'text-neutral-600'}`}`}
            >
              {series.team_b_score}
            </span>
            <figure className="flex flex-col place-items-center gap-2">
              <Image
                src={series.team_b?.logo_url!}
                alt={`${series.team_b?.school_abbrev} Logo`}
                width={40}
                height={40}
              />
              <figcaption className="rounded bg-neutral-800 px-4 py-1 text-xs font-semibold text-neutral-300">
                {series.team_b?.school_abbrev}
              </figcaption>
            </figure>
          </div>
        </div>
        {/* End of Team B */}

        {/* Date & Time */}
        <div className="flex justify-between">
          <div className="flex flex-col gap-4">
            <time className="flex gap-2 text-xs font-bold text-neutral-500">
              <CalendarIcon className="h-auto w-4" />
              {new Date(series.start_time).toLocaleDateString('en-CA', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
              })}
            </time>

            <time className="flex gap-2 text-xs font-bold text-neutral-500">
              <ClockIcon className="h-auto w-4" />
              {new Date(series.start_time).toLocaleTimeString('en-CA', {
                hour12: true,
                hour: '2-digit',
                minute: '2-digit'
              })}
              {' - '}
              {new Date(series.end_time).toLocaleTimeString('en-CA', {
                hour12: true,
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <div className="flex place-items-center gap-4">
            <ButtonUpdate
              onUpdate={() =>
                handleUpdate(
                  setModalProps,
                  formData,
                  series,
                  platformList,
                  teamList,
                  leagueScheduleList,
                  setCachedSeries
                )
              }
            />
            <div className="flex gap-1">
              <ButtonDelete onDelete={() => handleDelete(setModalProps, series, setCachedSeries)} />
            </div>
          </div>
        </div>
        {/* End of Date & Time */}
      </div>
      {/* End of Body */}

      {/* Footer */}
      <footer className="flex justify-between border-t-2 border-neutral-600 bg-neutral-900 px-4 py-2">
        <span className="text-xs font-semibold text-neutral-500">
          {series.league_schedule?.season_type} {series.league_schedule?.season_number}
          &nbsp; • &nbsp; {series.league_schedule?.league_stage}
        </span>
        <span className="flex gap-2 text-xs font-semibold text-neutral-500">
          Week {series.week}
          <Image
            width={16}
            height={16}
            src={series.platform?.logo_url!}
            alt={`${series.platform?.platform_abbrev} Logo`}
          />
        </span>
      </footer>
    </div>
  );
}
