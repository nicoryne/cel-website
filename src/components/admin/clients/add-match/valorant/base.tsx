'use client';

import { GamePlatform, Series, ValorantMap } from '@/lib/types';
import React from 'react';
import { CheckCircleIcon, ArrowRightCircleIcon, ArrowLeftCircleIcon } from '@heroicons/react/24/solid';
import { sortByStartTime } from '@/components/admin/clients/series/utils';
import MatchDetailsForm from '@/components/admin/clients/add-match/valorant/match-details';
import UploadPlayerStatistics from '@/components/admin/clients/add-match/valorant/upload-player-statistics';
import ValidatePlayerStatistics from '@/components/admin/clients/add-match/valorant/validate-player-statistics';

const steps = [
  { id: 1, name: 'Add Match Details' },
  { id: 2, name: 'Upload Player Statistics' },
  { id: 3, name: 'Validate Player Statistics' }
];

type ValorantMultiStepBaseProps = {
  seriesList: Promise<Series[]>;
  mapList: Promise<ValorantMap[]>;
  platformList: Promise<GamePlatform[]>;
};

export default function ValorantMultiStepBase({ seriesList, mapList, platformList }: ValorantMultiStepBaseProps) {
  const processedSeriesList = React.use(seriesList);
  const processedMapList = React.use(mapList);
  const processedPlatformList = React.use(platformList);

  const valorantPlatformId = processedPlatformList.find((platform) => platform.platform_abbrev === 'VALO');
  const valorantSeriesList = processedSeriesList
    .filter((series) => series.platform_id === valorantPlatformId?.id)
    .sort(sortByStartTime);

  const [currentStep, setCurrentStep] = React.useState<number>(1);

  const matchFormData = React.useRef({});
  const matchResultImage = React.useRef<string | undefined>(undefined);

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
        <section className="mx-auto my-4 flex max-w-[60%] items-center gap-8 py-16">
          {currentStep !== 1 && (
            <button
              type="button"
              className="w-fit rounded-lg p-4 text-neutral-600 duration-150 ease-linear hover:text-neutral-200"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              <ArrowLeftCircleIcon className="h-auto w-16" />
            </button>
          )}

          {currentStep === 1 && (
            <MatchDetailsForm
              seriesList={valorantSeriesList}
              mapList={processedMapList}
              match={null}
              formData={matchFormData}
            />
          )}

          {currentStep === 2 && <UploadPlayerStatistics imageData={matchResultImage} />}

          {currentStep === 3 && <ValidatePlayerStatistics imageData={matchResultImage} />}

          {currentStep !== 3 && (
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
