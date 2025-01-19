'use client';

import {
  GamePlatform,
  LeagueSchedule,
  Series,
  SeriesWithDetails,
  Team,
  ValorantMap,
  ValorantMatch,
  ValorantMatchWithDetails
} from '@/lib/types';
import React from 'react';
import { CheckCircleIcon, ArrowRightCircleIcon, ArrowLeftCircleIcon } from '@heroicons/react/24/solid';
import { sortByStartTime } from '@/components/admin/clients/series/utils';
import MatchDetailsForm from '@/components/admin/clients/add-match/valorant/match-details';
import UploadPlayerStatistics from '@/components/admin/clients/add-match/valorant/upload-player-statistics';
import ValidatePlayerStatistics from '@/components/admin/clients/add-match/valorant/validate-player-statistics';
import ChooseSeries from '@/components/admin/clients/add-match/valorant/choose-series';
import { appendSeriesDetails } from '@/api/series';

const steps = [
  { id: 1, name: 'Choose Series' },
  { id: 2, name: 'Add Match Details' },
  { id: 3, name: 'Upload Player Statistics' },
  { id: 4, name: 'Validate Player Statistics' }
];

type ValorantMultiStepBaseProps = {
  seriesList: Promise<Series[]>;
  mapList: Promise<ValorantMap[]>;
  platformList: Promise<GamePlatform[]>;
  teamsList: Promise<Team[]>;
  scheduleList: Promise<LeagueSchedule[]>;
};

export default function ValorantMultiStepBase({
  seriesList,
  mapList,
  platformList,
  teamsList,
  scheduleList
}: ValorantMultiStepBaseProps) {
  const processedSeriesList = React.use(seriesList);
  const processedMapList = React.use(mapList);
  const processedPlatformList = React.use(platformList);
  const processedTeamList = React.use(teamsList);
  const processedScheduleList = React.use(scheduleList);

  const valorantPlatformId = processedPlatformList.find((platform) => platform.platform_abbrev === 'VALO');
  const valorantSeriesList = processedSeriesList
    .filter((series) => series.platform_id === valorantPlatformId?.id)
    .sort(sortByStartTime);

  const detailedSeries: SeriesWithDetails[] = valorantSeriesList.map((series) =>
    appendSeriesDetails(processedPlatformList, processedTeamList, processedScheduleList, series)
  );

  const [currentStep, setCurrentStep] = React.useState<number>(1);

  const [matchInfo, setMatchInfo] = React.useState<Partial<ValorantMatchWithDetails>>({
    series: valorantSeriesList[0],
    map: processedMapList[0],
    match_duration: '00:00',
    match_number: 0,
    team_a_status: 'Draw',
    team_a_rounds: 0,
    team_b_status: 'Draw',
    team_b_rounds: 0
  });

  const updateMatchInfo = (field: keyof ValorantMatchWithDetails, value: string | number | Series | ValorantMap) => {
    setMatchInfo((matchInfo) => ({
      ...matchInfo,
      [field]: value
    }));
  };

  const matchResultImage = React.useRef<string | undefined>(undefined);

  const setSeries = (id: string) => {
    const series = valorantSeriesList.find((series) => series.id === id);

    if (series) {
      updateMatchInfo('series', series);
      setCurrentStep(2);
    }
  };

  React.useEffect(() => {
    if (matchInfo.team_a_rounds && matchInfo.team_b_rounds) {
      const teamARounds = matchInfo.team_a_rounds;
      const teamBRounds = matchInfo.team_b_rounds;

      const statusMapping =
        teamARounds > teamBRounds ? ['Win', 'Loss'] : teamARounds < teamBRounds ? ['Loss', 'Win'] : ['Draw', 'Draw'];

      updateMatchInfo('team_a_status', statusMapping[0]);
      updateMatchInfo('team_b_status', statusMapping[1]);
    }
  }, [matchInfo.team_a_rounds, matchInfo.team_b_rounds]);

  return (
    <>
      {/* Steps */}
      <aside className="w-full p-8">
        <ul className="flex justify-evenly">
          {steps.map((step) => (
            <li key={step.id}>
              <div
                className={`${step.id === currentStep ? 'text-[var(--cel-blue)] opacity-100' : 'text-neutral-600 opacity-70'} flex items-center gap-2`}
              >
                <CheckCircleIcon className="h-auto w-8" />
                <span>{step.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {valorantSeriesList && (
        <section className="mx-auto my-4 flex max-w-[80%] items-center gap-8 py-16">
          {currentStep !== 1 && (
            <button
              type="button"
              className="w-fit rounded-lg p-4 text-neutral-600 duration-150 ease-linear hover:text-neutral-200"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              <ArrowLeftCircleIcon className="h-auto w-16" />
            </button>
          )}

          {currentStep === 1 && <ChooseSeries seriesList={detailedSeries} setSeries={setSeries} />}

          {currentStep === 2 && (
            <MatchDetailsForm
              seriesList={valorantSeriesList}
              mapList={processedMapList}
              matchInfo={matchInfo}
              updateMatchInfo={updateMatchInfo}
            />
          )}

          {currentStep === 3 && <UploadPlayerStatistics imageData={matchResultImage} />}

          {currentStep === 4 && <ValidatePlayerStatistics imageData={matchResultImage} />}

          {currentStep !== 4 && (
            <button
              type="button"
              className="w-fit rounded-lg p-4 text-neutral-600 duration-150 ease-linear hover:text-neutral-200"
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              <ArrowRightCircleIcon className="h-auto w-16" />
            </button>
          )}
        </section>
      )}
    </>
  );
}
