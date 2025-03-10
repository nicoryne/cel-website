'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { LeagueSchedule } from '@/lib/types';
import { SeasonType } from '@/lib/enums';

type LeagueScheduleFormProps = {
  formData: React.MutableRefObject<{}>;
  schedule: LeagueSchedule | null;
};

export default function LeagueScheduleForm({ formData, schedule }: LeagueScheduleFormProps) {
  const seasonTypes = Object.values(SeasonType);

  const [startDate, setStartDate] = React.useState(schedule?.start_date || '');
  const [endDate, setEndDate] = React.useState(schedule?.end_date || '');
  const [leagueStageMenu, toggleLeagueStageMenu] = React.useState(false);
  const [leagueStage, setLeagueStage] = React.useState(schedule?.league_stage || '');
  const [seasonNumber, setSeasonNumber] = React.useState(schedule?.season_number || 0);
  const [seasonTypeMenu, toggleSeasonTypeMenu] = React.useState(false);
  const [seasonType, setSeasonType] = React.useState(schedule?.season_type || '');

  // Insert League Schedule
  React.useEffect(() => {
    let newFormData = {
      start_date: startDate,
      end_date: endDate,
      league_stage: leagueStage,
      season_number: seasonNumber,
      season_type: seasonType
    };

    formData.current = newFormData;
  }, [startDate, endDate, leagueStage, seasonNumber, seasonType, formData]);

  return (
    <form className="my-4 rounded-md border-2 border-neutral-700 bg-neutral-900 p-4">
      <div className="flex flex-col gap-4">
        {/* Dates */}
        <div className="flex justify-between">
          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="text-xs">
              Start Date
            </label>
            <div>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="flex h-10 items-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 px-2 text-base text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800 dark:[color-scheme:dark]"
                value={startDate.toString()}
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
              />
            </div>
          </div>
          {/* Start Date */}

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="text-xs">
              End Date
            </label>
            <div>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="flex h-10 items-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 px-2 text-base text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800 dark:[color-scheme:dark]"
                value={endDate.toString()}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
              />
            </div>
          </div>
          {/* End Date */}
        </div>
        {/* Season Type */}
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col items-end space-y-12">
            <div className="w-full">
              <label htmlFor="seasonType" className="text-xs">
                Season Type
              </label>
              <button
                type="button"
                id="seasonType"
                name="seasonType"
                className="flex h-10 w-full items-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 px-4 text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800"
                onClick={() => toggleSeasonTypeMenu(!seasonTypeMenu)}
              >
                <p className="text-xs md:text-base">{seasonType || 'Select Season Type'}</p>
              </button>
            </div>

            {seasonTypeMenu && (
              <motion.div
                className="absolute flex w-80 flex-col place-self-center rounded-md border-2 border-neutral-600 shadow-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 20 }}
              >
                {seasonTypes.map((type, index) => (
                  <button
                    className={`justify-left flex h-10 w-full place-items-center gap-2 px-4 text-neutral-300 hover:text-white ${
                      type === seasonType ? 'bg-neutral-800' : 'bg-[var(--background)]'
                    }`}
                    key={index}
                    onClick={() => {
                      setSeasonType(type);
                      toggleSeasonTypeMenu(!seasonTypeMenu);
                    }}
                  >
                    <p className="text-xs">{type}</p>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
          {/* Season Number */}
          <div>
            <label htmlFor="seasonNumber" className="text-xs">
              Season No.
            </label>
            <div>
              <input
                type="number"
                min="0"
                max="20"
                id="seasonNumber"
                name="seasonNumber"
                placeholder="0"
                className="h-10 w-16 rounded-md border-2 border-neutral-700 bg-neutral-900"
                value={seasonNumber || ''}
                onChange={(e) => setSeasonNumber(e.target?.valueAsNumber || 0)}
              />
            </div>
          </div>
        </div>

        {/* Schedule Stage */}
        <div>
          <label htmlFor="scheduleStage" className="text-xs">
            Schedule Stage
          </label>
          <div>
            <input
              type="text"
              placeholder="Enter Schedule Stage"
              id="scheduleStage"
              name="scheduleStage"
              className="flex h-10 w-full items-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 px-2 text-base text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800 dark:[color-scheme:dark]"
              value={leagueStage}
              onChange={(e) => {
                setLeagueStage(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
