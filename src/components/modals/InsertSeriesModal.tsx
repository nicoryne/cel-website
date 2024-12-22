'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  GamePlatform,
  LeagueSchedule,
  Team,
  SeriesType,
  Series,
  SeriesWithDetails
} from '@/lib/types';

type InsertSeriesModalProps = {
  teamsList: Team[];
  scheduleList: LeagueSchedule[];
  platforms: GamePlatform[];
  formData: React.MutableRefObject<{}>;
  series: SeriesWithDetails | null;
};

export default function InsertSeriesModal({
  teamsList,
  platforms,
  scheduleList,
  formData,
  series
}: InsertSeriesModalProps) {
  // Team
  const [teamA, setTeamA] = React.useState<Team>(
    series?.team_a || teamsList[3]
  );
  const [teamAScore, setTeamAScore] = React.useState(series?.team_a_score || 0);
  const [teamAMenu, toggleTeamAMenu] = React.useState(false);
  const [teamAStatus, setTeamAStatus] = React.useState(
    series?.team_a_status || 'Draw'
  );

  const [teamB, setTeamB] = React.useState<Team>(
    series?.team_b || teamsList[3]
  );
  const [teamBScore, setTeamBScore] = React.useState(series?.team_b_score || 0);
  const [teamBMenu, toggleTeamBMenu] = React.useState(false);
  const [teamBStatus, setTeamBStatus] = React.useState(
    series?.team_b_status || 'Draw'
  );

  React.useEffect(() => {
    if (teamAScore > teamBScore) {
      setTeamAStatus('Win');
      setTeamBStatus('Loss');
    } else if (teamBScore > teamAScore) {
      setTeamAStatus('Loss');
      setTeamBStatus('Win');
    } else if (teamAScore == teamBScore) {
      setTeamAStatus('Draw');
      setTeamBStatus('Draw');
    }
  }, [teamAScore, teamBScore]);

  // Platform
  const [selectedPlatform, setSelectedPlatform] = React.useState<GamePlatform>(
    series?.platform || platforms[0]
  );
  const [platformMenu, togglePlatformMenu] = React.useState(false);

  // Series Type
  const seriesTypeOptions = Object.values(SeriesType);

  const [selectedType, setSelectedType] = React.useState(
    series?.series_type || seriesTypeOptions[0]
  );
  const [typeMenu, toggleTypeMenu] = React.useState(false);

  // League Schedule
  const [selectedSchedule, setSelectedSchedule] =
    React.useState<LeagueSchedule>(series?.league_schedule || scheduleList[0]);
  const [scheduleMenu, toggleScheduleMenu] = React.useState(false);

  // Date & Time
  const [seriesDate, setSeriesDate] = React.useState<string>(
    series?.start_time
      ? new Date(series.start_time).toISOString().split('T')[0]
      : ''
  );

  const [startTime, setStartTime] = React.useState<string>(
    series?.start_time
      ? new Date(series.start_time).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit'
        })
      : ''
  );

  const [endTime, setEndTime] = React.useState<string>(
    series?.end_time
      ? new Date(series.end_time).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit'
        })
      : ''
  );

  // Week
  const [seriesWeek, setSeriesWeek] = React.useState(series?.week || 0);

  // Status
  const seriesStatusOptions = ['Upcoming', 'Ongoing', 'Finished'];
  const [seriesStatus, setSeriesStatus] = React.useState(
    series?.status || seriesStatusOptions[0]
  );
  const [statusMenu, toggleStatusMenu] = React.useState(false);

  // Insert New Series
  React.useEffect(() => {
    const startDateTime = `${seriesDate} ${startTime}:00`;
    const endDateTime = `${seriesDate} ${endTime}:00`;

    let newFormData = {
      league_schedule_id: selectedSchedule.id,
      platform_id: selectedPlatform.id,
      series_type: selectedType,
      team_a_id: teamA.id,
      team_a_score: teamAScore,
      team_a_status: teamAStatus,
      team_b_id: teamB.id,
      team_b_score: teamBScore,
      team_b_status: teamBStatus,
      week: seriesWeek,
      start_time: startDateTime,
      end_time: endDateTime,
      status: seriesStatus
    };

    formData.current = newFormData;
  });

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
                  src={teamA?.logo_url || '/placeholder.png'}
                  className="h-auto w-4"
                  width={128}
                  height={128}
                  alt={`${teamA?.school_abbrev || 'Team'} Logo`}
                />
                {teamA?.school_abbrev || 'Select Team'}
              </button>

              {/* Dropdown for Team A Selection */}
              {teamAMenu && (
                <motion.div
                  className="absolute grid grid-cols-3 rounded-md bg-[var(--background)] shadow-lg md:grid-cols-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 50 }}
                >
                  {teamsList.map((team, index) => (
                    <button
                      className={`flex h-16 w-16 flex-col place-items-center justify-center gap-2 text-neutral-300 hover:text-white md:h-24 md:w-24 ${
                        team.id === teamA?.id
                          ? 'bg-neutral-800'
                          : 'bg-[var(--background)]'
                      }`}
                      key={index}
                      onClick={() => {
                        setTeamA(team);
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
                      <p className="w-24 break-words text-xs">
                        {team.school_abbrev}
                      </p>
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
                value={teamAScore}
                className="w-16 rounded-md border-2 border-neutral-700 bg-neutral-900"
                onChange={(e) => setTeamAScore(e.target.valueAsNumber)}
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
                value={teamBScore}
                className="w-16 rounded-md border-2 border-neutral-700 bg-neutral-900"
                onChange={(e) => setTeamBScore(e.target.valueAsNumber)}
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
                  src={teamB?.logo_url || '/placeholder.png'}
                  className="h-auto w-4"
                  width={128}
                  height={128}
                  alt={`${teamB?.school_abbrev || 'Team'} Logo`}
                />
                {teamB?.school_abbrev || 'Select Team'}
              </button>

              {/* Dropdown for Team A Selection */}
              {teamBMenu && (
                <motion.div
                  className="absolute grid grid-cols-3 rounded-md bg-[var(--background)] shadow-lg md:grid-cols-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 50 }}
                >
                  {teamsList.map((team, index) => (
                    <button
                      className={`flex h-16 w-16 flex-col place-items-center justify-center gap-2 text-neutral-300 hover:text-white md:h-24 md:w-24 ${
                        team.id === teamB?.id
                          ? 'bg-neutral-800'
                          : 'bg-[var(--background)]'
                      }`}
                      key={index}
                      onClick={() => {
                        setTeamB(team);
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
                      <p className="w-24 break-words text-xs">
                        {team.school_abbrev}
                      </p>
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
              <p className="text-xs md:text-base">
                {seriesStatus || 'Select Status'}
              </p>
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
                      status === seriesStatus
                        ? 'bg-neutral-800'
                        : 'bg-[var(--background)]'
                    }`}
                    key={index}
                    onClick={() => {
                      setSeriesStatus(status);
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
                  src={selectedPlatform.logo_url || '/placeholder.png'}
                  className="h-auto w-4"
                  width={128}
                  height={128}
                  alt={`${selectedPlatform.platform_abbrev || 'Platform'} Logo`}
                />
                <p className="text-xs md:text-base">
                  {selectedPlatform.platform_title || 'Select Platform'}
                </p>
              </button>

              {/* Dropdown for Game Platform Selection */}
              {platformMenu && (
                <motion.div
                  className="absolute flex w-80 flex-col place-self-center rounded-md border-2 border-neutral-600 shadow-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {platforms.map((platform, index) => (
                    <button
                      className={`justify-left flex h-10 w-full place-items-center gap-2 px-4 text-neutral-300 hover:text-white ${
                        platform.id === selectedPlatform.id
                          ? 'bg-neutral-800'
                          : 'bg-[var(--background)]'
                      }`}
                      key={index}
                      onClick={() => {
                        setSelectedPlatform(platform);
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
                <p className="text-xs md:text-base">{selectedType || '--'}</p>
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
                        type === selectedType
                          ? 'bg-neutral-800'
                          : 'bg-[var(--background)]'
                      }`}
                      key={index}
                      onClick={() => {
                        setSelectedType(type);
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
                  {selectedSchedule.season_type +
                    ` ` +
                    selectedSchedule.season_number +
                    ` - ` +
                    selectedSchedule.league_stage || 'Select Schedule'}
                </p>
              </button>

              {/* Dropdown for Game Platform Selection */}
              {scheduleMenu && (
                <motion.div
                  className="absolute flex w-80 flex-col place-self-center rounded-md border-2 border-neutral-600 shadow-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {scheduleList.map((schedule, index) => (
                    <button
                      className={`justify-left flex h-10 w-full place-items-center gap-2 px-4 text-neutral-300 hover:text-white ${
                        schedule.id === selectedSchedule.id
                          ? 'bg-neutral-800'
                          : 'bg-[var(--background)]'
                      }`}
                      key={index}
                      onClick={() => {
                        setSelectedSchedule(schedule);
                        toggleScheduleMenu(!scheduleMenu);
                      }}
                    >
                      <p className="text-xs">
                        {schedule.season_type +
                          ` ` +
                          schedule.season_number +
                          ` - ` +
                          schedule.league_stage}
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
                value={seriesWeek || ''}
                onChange={(e) => setSeriesWeek(e.target?.valueAsNumber || 0)}
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
                value={seriesDate}
                onChange={(e) => {
                  setSeriesDate(e.target.value);
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
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
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
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
