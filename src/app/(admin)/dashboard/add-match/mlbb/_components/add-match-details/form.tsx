'use client';
import {
  MlbbMatchWithDetails,
  Series,
  Team,
  ValorantMap,
  ValorantMatchWithDetails
} from '@/lib/types';
import React from 'react';
import { getTeamById } from '@/services/team';
import Image from 'next/image';
import { CalendarIcon, ClockIcon } from '@heroicons/react/16/solid';
import not_found from '@/../../public/images/not-found.webp';

type MatchDetailsFormProps = {
  seriesList: Series[];
  matchInfo: Partial<MlbbMatchWithDetails>;
  updateMatchInfo: (field: keyof MlbbMatchWithDetails, value: string | number | Series) => void;
};
export default function MatchDetailsForm({ matchInfo, updateMatchInfo }: MatchDetailsFormProps) {
  const secondsInitial = matchInfo.match_duration?.split(':')[1];
  const minutesInitial = matchInfo.match_duration?.split(':')[0];

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
    updateMatchInfo('match_duration', `${minutes}:${seconds}`);
  }, [minutes, seconds]);

  const handleStatusChange = (team: string, checked: boolean) => {
    let teamAStatus = matchInfo.team_a_status;
    let teamBStatus = matchInfo.team_b_status;

    if (team === 'a') {
      teamAStatus = checked ? 'Win' : 'Loss';
    } else if (team === 'b') {
      teamBStatus = checked ? 'Win' : 'Loss';
    }

    if (!checked && matchInfo.team_a_status !== 'Win' && matchInfo.team_b_status !== 'Win') {
      teamAStatus = 'Draw';
      teamBStatus = 'Draw';
    } else {
      if (teamAStatus === 'Win') teamBStatus = 'Loss';
      if (teamBStatus === 'Win') teamAStatus = 'Loss';
    }

    if (teamAStatus && teamBStatus) {
      updateMatchInfo('team_a_status', teamAStatus);
      updateMatchInfo('team_b_status', teamBStatus);
    }
  };

  return (
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
                  <Image
                    className="rounded-full"
                    src={not_found}
                    alt={'Not Found Picture'}
                    height={100}
                    width={100}
                  />
                )}
                <figcaption className="rounded bg-neutral-800 px-4 py-1 text-xs font-semibold text-neutral-300">
                  {teams.team_a?.school_abbrev}
                </figcaption>
              </figure>
              <div className="relative flex flex-col gap-2">
                <label htmlFor="teamAWin" className="text-xs font-semibold text-neutral-400">
                  {teams.team_a?.school_abbrev} Win
                </label>
                <input
                  type="checkbox"
                  id="teamAWin"
                  checked={matchInfo.team_a_status === 'Win'}
                  onChange={(e) => handleStatusChange('a', e.target.checked)}
                  className="w-full rounded-md border-2 border-neutral-700 bg-neutral-900 text-center"
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
                  <Image
                    className="rounded-full"
                    src={not_found}
                    alt={'Not Found Picture'}
                    height={100}
                    width={100}
                  />
                )}
                <figcaption className="rounded bg-neutral-800 px-4 py-1 text-xs font-semibold text-neutral-300">
                  {teams.team_b?.school_abbrev}
                </figcaption>
              </figure>
              <div className="relative flex flex-col gap-2">
                <label htmlFor="teamBWin" className="text-xs font-semibold text-neutral-400">
                  {teams.team_b?.school_abbrev} Win
                </label>
                <input
                  type="checkbox"
                  id="teamBWin"
                  checked={matchInfo.team_b_status === 'Win'}
                  onChange={(e) => handleStatusChange('b', e.target.checked)}
                  className="w-full rounded-md border-2 border-neutral-700 bg-neutral-900 text-center"
                />
              </div>
            </div>
            {/* End of Team B */}
          </div>
        </div>
      </div>
    </div>
  );
}
