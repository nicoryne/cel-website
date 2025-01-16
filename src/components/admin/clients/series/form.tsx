'use client';
import React from 'react';
import Image from 'next/image';
import { GamePlatform, LeagueSchedule, SeriesFormType, SeriesWithDetails, Team } from '@/lib/types';

import { motion } from 'framer-motion';
import { SeriesType } from '@/lib/enums';

type SeriesFormProps = {
  formData: React.MutableRefObject<SeriesFormType | undefined>;
  series: SeriesWithDetails | null;
  platformList: GamePlatform[];
  teamList: Team[];
  leagueScheduleList: LeagueSchedule[];
};

export default function SeriesForm({ formData, series, platformList, teamList, leagueScheduleList }: SeriesFormProps) {
  const [seriesInfo, setSeriesInfo] = React.useState<SeriesFormType>({
    league_schedule: series?.league_schedule || leagueScheduleList[0],
    series_type: series?.series_type || '',
    team_a: series?.team_a || teamList[6],
    team_a_score: series?.team_a_score || 0,
    team_a_status: series?.team_a_status || 'Draw',
    team_b: series?.team_b || teamList[6],
    team_b_score: series?.team_b_score || 0,
    team_b_status: series?.team_b_status || 'Draw',
    week: series?.week || 1,
    status: series?.status || 'Upcoming',
    platform: series?.platform || platformList[0],
    date: series?.start_time ? new Date(series?.start_time!).toISOString().split('T')[0] : '',
    start_time:
      new Date(series?.start_time!).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      }) || new Date().toLocaleTimeString(),
    end_time:
      new Date(series?.end_time!).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      }) || new Date().toLocaleTimeString()
  });

  const [platformMenu, togglePlatformMenu] = React.useState(false);
  const [teamAMenu, toggleTeamAMenu] = React.useState(false);
  const [teamBMenu, toggleTeamBMenu] = React.useState(false);
  const seriesStatusOptions = ['Upcoming', 'Ongoing', 'Finished'];
  const [statusMenu, toggleStatusMenu] = React.useState(false);
  const seriesTypeOptions = Object.values(SeriesType);
  const [typeMenu, toggleTypeMenu] = React.useState(false);
  const [scheduleMenu, toggleScheduleMenu] = React.useState(false);

  const updateSeriesInfo = (
    field: keyof SeriesFormType,
    value: string | number | Date | LeagueSchedule | GamePlatform | Team
  ) => {
    setSeriesInfo((seriesInfo) => ({
      ...seriesInfo,
      [field]: value
    }));
  };

  React.useEffect(() => {
    const teamAScore = seriesInfo.team_a_score;
    const teamBScore = seriesInfo.team_b_score;

    const statusMapping =
      teamAScore > teamBScore ? ['Win', 'Loss'] : teamAScore < teamBScore ? ['Loss', 'Win'] : ['Draw', 'Draw'];

    updateSeriesInfo('team_a_status', statusMapping[0]);
    updateSeriesInfo('team_b_status', statusMapping[1]);
  }, [seriesInfo.team_a_score, seriesInfo.team_b_score]);

  // Insert New Series
  React.useEffect(() => {
    formData.current = seriesInfo;
  }, [seriesInfo, formData]);

  return (
    <form className="my-4 rounded-md border-2 border-neutral-700 bg-neutral-900 p-4">
      <div className="flex flex-col gap-4">
        {/* Teams */}
        <div className="flex flex-col justify-center gap-4 md:flex-row">
          {/* Team A */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col items-end space-y-12">
              {/* Button to select Team A */}
              <button
                type="button"
                className="flex h-24 w-24 flex-col items-center justify-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800"
                onClick={() => toggleTeamAMenu(!teamAMenu)}
              >
                <Image
                  src={seriesInfo.team_a.logo_url}
                  className="h-auto w-4"
                  width={128}
                  height={128}
                  alt={`${seriesInfo?.team_a.school_abbrev || 'Team'} Logo`}
                />
                {seriesInfo.team_a.school_abbrev || 'Select Team'}
              </button>

              {/* Dropdown for Team A Selection */}
              {teamAMenu && (
                <motion.div
                  className="absolute grid grid-cols-3 rounded-md bg-[var(--background)] shadow-lg md:grid-cols-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 50 }}
                >
                  {teamList.map((team, index) => (
                    <button
                      className={`flex h-16 w-16 flex-col place-items-center justify-center gap-2 text-neutral-300 hover:text-white md:h-24 md:w-24 ${
                        team.id === seriesInfo.team_a.id ? 'bg-neutral-800' : 'bg-[var(--background)]'
                      }`}
                      key={index}
                      onClick={() => {
                        updateSeriesInfo('team_a', team);
                        toggleTeamAMenu(!teamAMenu);
                      }}
                    >
                      <Image
                        src={team.logo_url}
                        className="h-auto w-4"
                        width={128}
                        height={128}
                        alt={`${team.school_abbrev} Logo`}
                      />
                      <p className="w-24 break-words text-xs">{team.school_abbrev}</p>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
            {/* End of Team A */}
            <div>
              <input
                type="number"
                min="0"
                max="5"
                value={seriesInfo.team_a_score}
                className="w-16 rounded-md border-2 border-neutral-700 bg-neutral-900"
                onChange={(e) => updateSeriesInfo('team_a_score', e.target.valueAsNumber)}
              />
            </div>
          </div>

          {/* Vs Container */}
          <div className="flex items-center justify-center">
            <p>vs</p>
          </div>
          {/* End of Vs Container */}
          <div className="flex items-center justify-center gap-4">
            <div>
              <input
                type="number"
                min="0"
                max="5"
                value={seriesInfo.team_b_score}
                className="w-16 rounded-md border-2 border-neutral-700 bg-neutral-900"
                onChange={(e) => updateSeriesInfo('team_b_score', e.target.valueAsNumber)}
              />
            </div>
            {/* Team B */}
            <div className="flex flex-col items-end space-y-12">
              {/* Button to select Team B */}
              <button
                type="button"
                className="flex h-24 w-24 flex-col items-center justify-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800"
                onClick={() => toggleTeamBMenu(!teamBMenu)}
              >
                <Image
                  src={seriesInfo.team_b.logo_url}
                  className="h-auto w-4"
                  width={128}
                  height={128}
                  alt={`${seriesInfo?.team_b.school_abbrev || 'Team'} Logo`}
                />
                {seriesInfo?.team_b.school_abbrev || 'Select Team'}
              </button>

              {/* Dropdown for Team A Selection */}
              {teamBMenu && (
                <motion.div
                  className="absolute grid grid-cols-3 rounded-md bg-[var(--background)] shadow-lg md:grid-cols-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 50 }}
                >
                  {teamList.map((team, index) => (
                    <button
                      className={`flex h-16 w-16 flex-col place-items-center justify-center gap-2 text-neutral-300 hover:text-white md:h-24 md:w-24 ${
                        team.id === seriesInfo.team_b?.id ? 'bg-neutral-800' : 'bg-[var(--background)]'
                      }`}
                      key={index}
                      onClick={() => {
                        updateSeriesInfo('team_b', team);
                        toggleTeamBMenu(!teamBMenu);
                      }}
                    >
                      <Image
                        src={team.logo_url}
                        className="h-auto w-4"
                        width={128}
                        height={128}
                        alt={`${team.school_abbrev} Logo`}
                      />
                      <p className="w-24 break-words text-xs">{team.school_abbrev}</p>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
            {/* End of Team B */}
          </div>
        </div>
        {/* Series Status */}
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-xs">Series Status</span>
          <div className="flex flex-col items-end space-y-12">
            {/* Button to select Series Status */}
            <button
              type="button"
              className="flex h-10 w-full items-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 px-4 text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800"
              onClick={() => toggleStatusMenu(!statusMenu)}
            >
              <p className="text-xs md:text-base">{seriesInfo.status || 'Select Status'}</p>
            </button>

            {/* Dropdown for Game Platform Selection */}
            {statusMenu && (
              <motion.div
                className="absolute flex w-80 flex-col place-self-center rounded-md border-2 border-neutral-600 shadow-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {seriesStatusOptions.map((status, index) => (
                  <button
                    className={`justify-left flex h-10 w-full place-items-center gap-2 px-4 text-neutral-300 hover:text-white ${
                      status === seriesInfo.status ? 'bg-neutral-800' : 'bg-[var(--background)]'
                    }`}
                    key={index}
                    onClick={() => {
                      updateSeriesInfo('status', status);
                      toggleStatusMenu(!statusMenu);
                    }}
                  >
                    <p className="text-xs">{status}</p>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
        {/* End of Series Status */}
        {/* End of Teams */}
        <div className="flex gap-4">
          {/* Game Platform */}
          <div className="flex flex-1 flex-col gap-2">
            <span className="text-xs">Game</span>
            <div className="flex flex-col items-end space-y-12">
              {/* Button to select Game Platform */}
              <button
                type="button"
                className="flex h-10 w-full items-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 px-4 text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800"
                onClick={() => togglePlatformMenu(!platformMenu)}
              >
                <Image
                  src={seriesInfo.platform.logo_url}
                  className="h-auto w-4"
                  width={128}
                  height={128}
                  alt={`${seriesInfo.platform.platform_abbrev || 'Platform'} Logo`}
                />
                <p className="text-xs md:text-base">{seriesInfo.platform.platform_title || 'Select Platform'}</p>
              </button>

              {/* Dropdown for Game Platform Selection */}
              {platformMenu && (
                <motion.div
                  className="absolute flex w-80 flex-col place-self-center rounded-md border-2 border-neutral-600 shadow-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {platformList.map((platform, index) => (
                    <button
                      className={`justify-left flex h-10 w-full place-items-center gap-2 px-4 text-neutral-300 hover:text-white ${
                        platform.id === seriesInfo.platform.id ? 'bg-neutral-800' : 'bg-[var(--background)]'
                      }`}
                      key={index}
                      onClick={() => {
                        updateSeriesInfo('platform', platform);
                        togglePlatformMenu(!platformMenu);
                      }}
                    >
                      <Image
                        src={platform.logo_url}
                        className="h-auto w-4"
                        width={128}
                        height={128}
                        alt={`${platform.platform_abbrev} Logo`}
                      />
                      <p className="text-xs">{platform.platform_title}</p>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
          {/* End of Game Platform */}
          {/* Series Type */}
          <div>
            <span className="text-xs">Series Type</span>
            <div className="flex flex-col items-end space-y-12">
              {/* Button to select Series Type */}
              <button
                type="button"
                className="flex h-10 w-full items-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 px-4 text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800"
                onClick={() => toggleTypeMenu(!typeMenu)}
              >
                <p className="text-xs md:text-base">{seriesInfo.series_type || '--'}</p>
              </button>

              {/* Dropdown for Series type Selection */}
              {typeMenu && (
                <motion.div
                  className="absolute flex w-16 flex-col place-self-center rounded-md border-2 border-neutral-600 shadow-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {seriesTypeOptions.map((type, index) => (
                    <button
                      type="button"
                      className={`justify-left flex h-10 w-full place-items-center gap-2 px-4 text-neutral-300 hover:text-white ${
                        type === seriesInfo.series_type ? 'bg-neutral-800' : 'bg-[var(--background)]'
                      }`}
                      key={index}
                      onClick={() => {
                        updateSeriesInfo('series_type', type);
                        toggleTypeMenu(!typeMenu);
                      }}
                    >
                      <p className="text-xs">{type}</p>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
          {/* End of Series Type */}
        </div>

        {/* League Schedule and Week */}
        <div className="flex gap-4">
          {/* League Schedule */}
          <div className="flex flex-1 flex-col gap-2">
            <span className="text-xs">League Schedule</span>
            <div className="flex flex-col items-end space-y-12">
              {/* Button to select League Schedule */}
              <button
                type="button"
                className="flex h-10 w-full items-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 px-4 text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800"
                onClick={() => toggleScheduleMenu(!scheduleMenu)}
              >
                <p className="text-xs md:text-base">
                  {seriesInfo.league_schedule.season_type +
                    ` ` +
                    seriesInfo.league_schedule.season_number +
                    ` - ` +
                    seriesInfo.league_schedule.league_stage || 'Select Schedule'}
                </p>
              </button>

              {/* Dropdown for League Schedule Selection */}
              {scheduleMenu && (
                <motion.div
                  className="absolute flex w-80 flex-col place-self-center rounded-md border-2 border-neutral-600 shadow-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {leagueScheduleList.map((schedule, index) => (
                    <button
                      className={`justify-left flex h-10 w-full place-items-center gap-2 px-4 text-neutral-300 hover:text-white ${
                        schedule.id === seriesInfo.league_schedule.id ? 'bg-neutral-800' : 'bg-[var(--background)]'
                      }`}
                      key={index}
                      onClick={() => {
                        updateSeriesInfo('league_schedule', schedule);
                        toggleScheduleMenu(!scheduleMenu);
                      }}
                    >
                      <p className="text-xs">
                        {schedule.season_type + ` ` + schedule.season_number + ` - ` + schedule.league_stage}
                      </p>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
          {/* End of league Schedule */}
          {/* Week */}
          <div>
            <span className="text-xs">Week No.</span>
            <div>
              <input
                type="number"
                min="0"
                max="20"
                className="h-10 w-16 rounded-md border-2 border-neutral-700 bg-neutral-900"
                value={seriesInfo.week}
                onChange={(e) => updateSeriesInfo('week', e.target.valueAsNumber)}
              />
            </div>
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-col gap-2">
            {/* Date */}
            <span className="text-xs">Date</span>
            <div>
              <input
                type="date"
                className="flex h-10 items-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 px-2 text-base text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800 dark:[color-scheme:dark]"
                value={seriesInfo.date}
                onChange={(e) => {
                  updateSeriesInfo('date', e.target.value);
                }}
              />
            </div>
          </div>

          {/* Start Time */}
          <div className="flex flex-col gap-2">
            <span className="text-xs">Start Time</span>
            <div>
              <input
                type="time"
                className="flex h-10 items-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 px-2 text-xs text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800 dark:[color-scheme:dark]"
                value={seriesInfo.start_time}
                onChange={(e) => {
                  updateSeriesInfo('start_time', e.target.value);
                }}
              />
            </div>
          </div>

          {/* End Time */}
          <div className="flex flex-col gap-2">
            <span className="text-xs">End Time</span>
            <div>
              <input
                type="time"
                className="flex h-10 items-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 px-2 text-xs text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800 dark:[color-scheme:dark]"
                value={seriesInfo.end_time}
                onChange={(e) => {
                  updateSeriesInfo('end_time', e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
