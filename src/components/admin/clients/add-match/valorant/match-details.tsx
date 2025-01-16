'use client';
import { Series, ValorantMap, ValorantMatchWithDetails } from '@/lib/types';
import { motion } from 'framer-motion';
import { shortenSeriesName } from '@/api/series';
import React from 'react';

type MatchDetailsFormProps = {
  seriesList: Series[];
  mapList: ValorantMap[];
  match: ValorantMatchWithDetails | null;
  formData: React.MutableRefObject<{} | undefined>;
};
export default function MatchDetailsForm({ seriesList, mapList, match, formData }: MatchDetailsFormProps) {
  const [matchInfo, setMatchInfo] = React.useState<Partial<ValorantMatchWithDetails>>({
    series: match?.series || seriesList[0],
    map: match?.map || mapList[0],
    match_duration: match?.match_duration || '00:00',
    match_number: match?.match_number || 0,
    team_a_status: match?.team_a_status || 'Draw',
    team_a_rounds: match?.team_a_rounds || 0,
    team_b_status: match?.team_b_status || 'Draw',
    team_b_rounds: match?.team_b_rounds || 0
  });

  const updateMatchInfo = (field: keyof ValorantMatchWithDetails, value: string | number | Series | ValorantMap) => {
    setMatchInfo((matchInfo) => ({
      ...matchInfo,
      [field]: value
    }));
  };

  React.useEffect(() => {
    formData.current = matchInfo;
  }, [matchInfo]);

  const [seriesMenu, toggleSeriesMenu] = React.useState(false);
  const [mapMenu, toggleMapMenu] = React.useState(false);

  return (
    <form className="w-full rounded-md border-2 border-neutral-700 bg-neutral-900 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="relative flex w-full flex-1 flex-col items-end space-y-12">
            <div className="w-full">
              <label htmlFor="series" className="text-xs">
                Series
              </label>
              <button
                type="button"
                id="series"
                name="series"
                className="flex h-10 w-full items-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 px-4 text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800"
                onClick={() => toggleSeriesMenu(!seriesMenu)}
              >
                <p className="text-xs md:text-base">{shortenSeriesName(matchInfo.series!) || 'Select Series'}</p>
              </button>
            </div>

            {seriesMenu && (
              <motion.div
                className="absolute flex w-full flex-col rounded-md border-2 border-neutral-600 shadow-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 20 }}
              >
                {seriesList.map((series, index) => (
                  <button
                    className={`justify-left flex h-10 w-full place-items-center gap-2 px-4 text-neutral-300 hover:text-white ${
                      series.id === matchInfo.series?.id ? 'bg-neutral-800' : 'bg-[var(--background)]'
                    }`}
                    key={index}
                    onClick={() => {
                      updateMatchInfo('series', series);
                      toggleSeriesMenu(!seriesMenu);
                    }}
                  >
                    <p className="text-xs">{shortenSeriesName(series)}</p>
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          <div className="relative flex w-full flex-1 flex-col items-end space-y-12">
            <div className="w-full">
              <label htmlFor="map" className="text-xs">
                Map
              </label>
              <button
                type="button"
                id="map"
                name="map"
                className="flex h-10 w-full items-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 px-4 text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800"
                onClick={() => toggleMapMenu(!mapMenu)}
              >
                <p className="text-xs md:text-base">{matchInfo.map?.name || 'Select Map'}</p>
              </button>
            </div>

            {mapMenu && (
              <motion.div
                className="absolute flex w-full flex-col place-self-center rounded-md border-2 border-neutral-600 shadow-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 20 }}
              >
                {mapList.map((map, index) => (
                  <button
                    className={`justify-left flex h-10 w-full place-items-center gap-2 px-4 text-neutral-300 hover:text-white ${
                      map.id === matchInfo.map?.id ? 'bg-neutral-800' : 'bg-[var(--background)]'
                    }`}
                    key={index}
                    onClick={() => {
                      updateMatchInfo('map', map);
                      toggleMapMenu(!mapMenu);
                    }}
                  >
                    <p className="text-xs">{map.name}</p>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-full flex-1">
            <label htmlFor="duration" className="text-xs">
              Match Duration
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              className="flex h-10 w-full items-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 px-4 text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800"
            />
          </div>
          <div className="w-32">
            <label htmlFor="matchNumber" className="text-xs">
              Match Number
            </label>
            <input
              type="number"
              id="matchNumber"
              name="matchNumber"
              min={1}
              max={5}
              className="flex h-10 w-full items-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 px-4 text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-full">
            <label htmlFor="duration" className="text-xs">
              Team A Status
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              className="flex h-10 w-full items-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 px-4 text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800"
            />
          </div>
          <div className="w-full">
            <label htmlFor="matchNumber" className="text-xs">
              Team A Rounds
            </label>
            <input
              type="number"
              id="matchNumber"
              name="matchNumber"
              min={0}
              max={13}
              className="flex h-10 w-full items-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 px-4 text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-full">
            <label htmlFor="duration" className="text-xs">
              Team B Status
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              className="flex h-10 w-full items-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 px-4 text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800"
            />
          </div>
          <div className="w-full">
            <label htmlFor="matchNumber" className="text-xs">
              Team B Rounds
            </label>
            <input
              type="number"
              id="matchNumber"
              name="matchNumber"
              min={0}
              max={13}
              className="flex h-10 w-full items-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 px-4 text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
