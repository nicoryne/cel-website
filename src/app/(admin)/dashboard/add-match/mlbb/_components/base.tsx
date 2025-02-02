'use client';

import {
  Character,
  GamePlatform,
  LeagueSchedule,
  MlbbMatchWithDetails,
  Series,
  SeriesWithDetails,
  Team,
  ValorantMap,
  ValorantMatchesPlayerStatsWithDetails,
  ValorantMatchWithDetails
} from '@/lib/types';
import React, { useState } from 'react';
import {
  CheckCircleIcon,
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon
} from '@heroicons/react/24/solid';
import { sortByStartTime } from '@/app/(admin)/dashboard/series/_components/utils';
import MatchDetailsForm from '@/app/(admin)/dashboard/add-match/mlbb/_components/add-match-details/form';
import UploadPlayerStatisticsPanel from '@/app/(admin)/dashboard/add-match/mlbb/_components/upload-image/panel';
import ValidatePlayerStatisticsPanel from '@/app/(admin)/dashboard/add-match/mlbb/_components/validate-statistics/panel';
import ChooseSeries from '@/app/(admin)/dashboard/add-match/mlbb/_components/choose-series/panel';
import { appendSeriesDetails } from '@/api/series';
import { doesValorantMatchExist } from '@/api/valorant-match';

const steps = [
  { id: 1, name: 'Choose Series' },
  { id: 2, name: 'Add Match Details' },
  { id: 3, name: 'Upload Player Statistics' },
  { id: 4, name: 'Validate Player Statistics' }
];

type MlbbMultiStepBaseProps = {
  seriesList: Promise<Series[]>;
  platformList: Promise<GamePlatform[]>;
  teamsList: Promise<Team[]>;
  scheduleList: Promise<LeagueSchedule[]>;
};

export default function MlbbMultiStepBase({
  seriesList,
  platformList,
  teamsList,
  scheduleList
}: MlbbMultiStepBaseProps) {
  const processedSeriesList = React.use(seriesList);
  const processedPlatformList = React.use(platformList);
  const processedTeamsList = React.use(teamsList);
  const processedScheduleList = React.use(scheduleList);
  const [error, setError] = useState('');

  const mlbbPlatformId = processedPlatformList.find(
    (platform) => platform.platform_abbrev === 'MLBB'
  );
  const mlbbSeriesList = processedSeriesList
    .filter((series) => series.platform_id === mlbbPlatformId?.id)
    .sort(sortByStartTime);

  const detailedSeries: SeriesWithDetails[] = mlbbSeriesList.map((series) =>
    appendSeriesDetails(processedPlatformList, processedTeamsList, processedScheduleList, series)
  );

  const [currentStep, setCurrentStep] = React.useState<number>(1);

  const [matchInfo, setMatchInfo] = React.useState<Partial<MlbbMatchWithDetails>>({
    series: mlbbSeriesList[0],
    match_duration: '00:00',
    match_number: 0,
    team_a_status: 'Draw',
    team_b_status: 'Draw'
  });

  const updateMatchInfo = (field: keyof MlbbMatchWithDetails, value: string | number | Series) => {
    setMatchInfo((matchInfo) => ({
      ...matchInfo,
      [field]: value
    }));
  };

  const matchEquipmentImage = React.useRef<string | undefined>(undefined);
  const matchDataIamge = React.useRef<string | undefined>(undefined);

  const setSeries = (id: string) => {
    const series = mlbbSeriesList.find((series) => series.id === id);

    if (series) {
      updateMatchInfo('series', series);
      setCurrentStep(2);
    }
  };

  const handleNext = async () => {
    if (currentStep == 2) {
      if (!matchInfo.match_number || !matchInfo.series || !matchInfo.match_duration) {
        setError('Incomplete Match Info.');
        return;
      }
      const doesMatchExist = await doesValorantMatchExist(
        matchInfo.series?.id,
        matchInfo.match_number
      );

      if (doesMatchExist) {
        setError('Match already exists.');
        return;
      }
    }

    if (error.length > 0) {
      setError('');
    }
    setCurrentStep(currentStep + 1);
  };
  return (
    <>
      {/* Steps */}
      <aside className="w-full p-8">
        <ul className="flex justify-evenly">
          {steps.map((step) => (
            <li key={step.id}>
              <div
                className={`${step.id === currentStep ? 'text-yale opacity-100' : 'text-neutral-600 opacity-70'} flex items-center gap-2`}
              >
                <CheckCircleIcon className="h-auto w-8" />
                <span>{step.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {mlbbSeriesList && (
        <section className="mx-auto flex h-full w-full justify-center gap-8 overflow-y-scroll">
          <button
            type="button"
            disabled={currentStep === 1}
            className={`w-fit rounded-lg p-4 duration-150 ease-linear ${currentStep === 1 ? 'text-neutral-800' : 'text-neutral-600 hover:text-neutral-200'}`}
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            <ArrowLeftCircleIcon className="h-auto w-16" />
          </button>

          <div className="mt-12 h-[40vh] w-[90vw]">
            {currentStep === 1 && (
              <ChooseSeries seriesList={detailedSeries} setSeries={setSeries} />
            )}

            {currentStep === 2 && (
              <MatchDetailsForm
                seriesList={mlbbSeriesList}
                matchInfo={matchInfo}
                updateMatchInfo={updateMatchInfo}
              />
            )}

            {currentStep === 3 && (
              <UploadPlayerStatisticsPanel
                equipmentImageData={matchEquipmentImage}
                dataImageData={matchDataIamge}
              />
            )}

            {currentStep === 4 && (
              <ValidatePlayerStatisticsPanel
                teamsList={processedTeamsList}
                equipmentImageData={matchEquipmentImage}
                dataImageData={matchDataIamge}
                mlbbPlatformId={mlbbPlatformId?.id!}
                matchInfo={matchInfo}
              />
            )}

            <p className="mt-8 text-xs text-chili">{error}</p>
          </div>

          <button
            type="button"
            disabled={currentStep === 4}
            className={`w-fit rounded-lg p-4 duration-150 ease-linear ${currentStep === 4 ? 'text-neutral-800' : 'text-neutral-600 hover:text-neutral-200'}`}
            onClick={() => handleNext()}
          >
            <ArrowRightCircleIcon className="h-auto w-16" />
          </button>
        </section>
      )}
    </>
  );
}
