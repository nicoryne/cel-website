'use client';
import { Series, Team, ValorantMap, ValorantMatchWithDetails } from '@/lib/types';
import React from 'react';
import { getTeamById } from '@/api/team';
import Image from 'next/image';
import { CalendarIcon, ClockIcon } from '@heroicons/react/16/solid';
import not_found from '@/../../public/images/not-found.webp';
import PaginationControls from '@/components/admin/pagination';

type MatchDetailsFormProps = {
  seriesList: Series[];
  mapList: ValorantMap[];
  matchInfo: Partial<ValorantMatchWithDetails>;
  updateMatchInfo: (field: keyof ValorantMatchWithDetails, value: string | number | Series | ValorantMap) => void;
};
export default function MatchDetailsForm({ mapList, matchInfo, updateMatchInfo }: MatchDetailsFormProps) {
  const mapIndex = matchInfo.map ? mapList.findIndex((map) => map.id === matchInfo.map?.id) + 1 : 1;
  const secondsInitial = matchInfo.match_duration?.split(':')[1];
  const minutesInitial = matchInfo.match_duration?.split(':')[0];

  const [currentPage, setCurrentPage] = React.useState(mapIndex);

  const [seconds, setSeconds] = React.useState(secondsInitial);
  const [minutes, setMinutes] = React.useState(minutesInitial);

  const [teams, setTeams] = React.useState<{
    team_a: Team | null;
    team_b: Team | null;
  }>({
    team_a: null,
    team_b: null
  });

  React.useEffect(() => {
    const fetchTeams = async () => {
      if (matchInfo.series?.team_a_id && matchInfo.series?.team_b_id) {
        const teamA = await getTeamById(matchInfo.series.team_a_id);
        const teamB = await getTeamById(matchInfo.series.team_b_id);

        setTeams({
          team_a: teamA,
          team_b: teamB
        });
      }
    };

    fetchTeams();
  }, [matchInfo.series]);

  React.useEffect(() => {
    updateMatchInfo('map', mapList[currentPage - 1]);
  }, [currentPage]);

  React.useEffect(() => {
    updateMatchInfo('match_duration', `${minutes}:${seconds}`);
  }, [minutes, seconds]);

  return (
    <div className="w-full rounded-md border-2 border-neutral-700 bg-neutral-900 p-4">
      <div className="flex flex-col gap-8">
        <div className="flex w-full justify-between">
          <h1 className="text-xs font-bold text-neutral-500">Match Details</h1>
          {matchInfo?.series && (
            <div className="flex items-center gap-4">
              <time className="flex gap-2 text-xs font-bold text-neutral-500">
                <CalendarIcon className="h-auto w-4" />
                {new Date(matchInfo.series?.start_time).toLocaleDateString('en-CA', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric'
                })}
              </time>

              <time className="flex gap-2 text-xs font-bold text-neutral-500">
                <ClockIcon className="h-auto w-4" />
                {new Date(matchInfo.series?.start_time).toLocaleTimeString('en-CA', {
                  hour12: true,
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                {' - '}
                {new Date(matchInfo.series?.end_time).toLocaleTimeString('en-CA', {
                  hour12: true,
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </time>
            </div>
          )}
        </div>
        <div className="flex">
          <div className="flex flex-col gap-4">
            <div className="flex h-fit w-fit flex-col gap-4 border-2 border-neutral-600 p-1 text-center">
              {matchInfo.map?.splash_image_url ? (
                <Image
                  src={matchInfo.map?.splash_image_url!}
                  alt={`${matchInfo.map?.name} Picture`}
                  height={400}
                  width={400}
                />
              ) : (
                <Image src={not_found} alt={'Not Found Picture'} height={400} width={400} />
              )}
              <div className="flex items-center justify-center gap-4">
                <span className="text-xs font-semibold text-neutral-200">Current Map:</span>
                <span
                  className={`rounded-lg px-4 py-1 text-xs font-semibold ${matchInfo.map?.is_active ? 'bg-green-800' : 'bg-red-800'}`}
                >
                  {matchInfo?.map?.name}
                </span>
              </div>
              <PaginationControls
                currentPage={currentPage}
                totalPages={mapList.length}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
          <div className="flex flex-1 px-8">
            <div className="flex w-full place-items-center justify-between">
              {/* Team A */}
              <div className="flex flex-col place-items-center justify-center gap-4">
                <figure className="flex flex-col place-items-center gap-2">
                  {teams.team_a?.logo_url ? (
                    <Image
                      src={teams.team_a?.logo_url!}
                      alt={`${teams.team_a?.school_abbrev} Logo`}
                      width={100}
                      height={100}
                    />
                  ) : (
                    <Image src={not_found} alt={'Not Found Picture'} height={100} width={100} />
                  )}
                  <figcaption className="rounded bg-neutral-800 px-4 py-1 text-xs font-semibold text-neutral-300">
                    {teams.team_a?.school_abbrev}
                  </figcaption>
                </figure>
                <div className="relative flex flex-col gap-2">
                  <label htmlFor="teamARounds" className="text-xs font-semibold text-neutral-400">
                    {teams.team_a?.school_abbrev} Rounds Won
                  </label>
                  <input
                    type="number"
                    id="teamARounds"
                    name="teamARounds"
                    min="0"
                    max="100"
                    value={matchInfo?.team_a_rounds}
                    onChange={(e) => {
                      updateMatchInfo('team_a_rounds', e.target.valueAsNumber);
                    }}
                    className="w-full rounded-md border-2 border-neutral-700 bg-neutral-900 text-center text-2xl"
                  />
                </div>
              </div>
              {/* End of Team A */}

              {/* Middle */}
              <div className="flex h-full flex-col gap-2 pt-16">
                <div className="relative mx-auto flex w-fit flex-col gap-2 text-center">
                  <span className="text-xs font-semibold text-neutral-400">Match Number</span>
                  <input
                    type="number"
                    id="matchNumber"
                    name="matchNumber"
                    placeholder="1"
                    min="0"
                    max="5"
                    value={matchInfo.match_number}
                    onChange={(e) => {
                      updateMatchInfo('match_number', e.target.valueAsNumber);
                    }}
                    className="w-full rounded-md border-2 border-neutral-700 bg-neutral-900 text-center text-2xl"
                  />
                </div>
                <div className="flex flex-col place-items-center gap-4">
                  <span className="font-bold text-neutral-600">Match Duration</span>
                  <div className="flex gap-4">
                    <div className="relative flex w-16 flex-col gap-2 text-center">
                      <span className="text-xs font-semibold text-neutral-400">Minutes</span>
                      <input
                        type="text"
                        id="minutes"
                        name="minutes"
                        placeholder="00"
                        value={minutes}
                        onChange={(e) => setMinutes(e.target.value)}
                        className="w-full rounded-md border-2 border-neutral-700 bg-neutral-900 text-center text-2xl"
                      />
                    </div>
                    <span className="my-8 text-2xl text-neutral-400">:</span>
                    <div className="relative flex w-16 flex-col gap-2 text-center">
                      <span className="text-xs font-semibold text-neutral-400">Seconds</span>
                      <input
                        type="text"
                        id="seconds"
                        name="seconds"
                        placeholder="00"
                        value={seconds}
                        onChange={(e) => setSeconds(e.target.value)}
                        className="w-full rounded-md border-2 border-neutral-700 bg-neutral-900 text-center text-2xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* End of Middle */}

              {/* Team B */}
              <div className="flex flex-col place-items-center justify-center gap-4">
                <figure className="flex flex-col place-items-center gap-2">
                  {teams.team_b?.logo_url ? (
                    <Image
                      src={teams.team_b?.logo_url!}
                      alt={`${teams.team_b?.school_abbrev} Logo`}
                      width={100}
                      height={100}
                    />
                  ) : (
                    <Image src={not_found} alt={'Not Found Picture'} height={100} width={100} />
                  )}
                  <figcaption className="rounded bg-neutral-800 px-4 py-1 text-xs font-semibold text-neutral-300">
                    {teams.team_b?.school_abbrev}
                  </figcaption>
                </figure>
                <div className="relative flex flex-col gap-2">
                  <label htmlFor="teamBRounds" className="text-xs font-semibold text-neutral-400">
                    {teams.team_b?.school_abbrev} Rounds Won
                  </label>
                  <input
                    type="number"
                    id="teamBRounds"
                    name="teamBRounds"
                    min="0"
                    max="100"
                    value={matchInfo?.team_b_rounds}
                    onChange={(e) => {
                      updateMatchInfo('team_b_rounds', e.target.valueAsNumber);
                    }}
                    className="w-full rounded-md border-2 border-neutral-700 bg-neutral-900 text-center text-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
