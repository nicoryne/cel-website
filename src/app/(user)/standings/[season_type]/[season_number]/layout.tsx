import { Suspense } from 'react';
import { ChevronDoubleRightIcon } from '@heroicons/react/20/solid';
import StageLinks from '@/app/(user)/standings/_components/stage-links';
import PlatformLinks from '@/app/(user)/standings/_components/platform-links';
import Loading from '@/components/loading';
import { getLeagueStageByTypeAndNumber } from '@/services/league-schedule';
import { getAllGamePlatforms } from '@/services/game-platform';

interface SeasonStandingsLayoutProps {
  params: {
    season_type: string;
    season_number: string;
  };
  children: React.ReactNode;
}

async function StagesComponent({
  seasonType,
  seasonNumber
}: {
  seasonType: string;
  seasonNumber: number;
}) {
  const stages = await getLeagueStageByTypeAndNumber(seasonType, seasonNumber);
  return stages ? (
    <ul className="flex list-none gap-4 xl:gap-6">
      <StageLinks stages={stages} />
    </ul>
  ) : null;
}

async function PlatformsComponent({ seasonNumber }: { seasonNumber: number }) {
  let platforms = await getAllGamePlatforms();
  if (seasonNumber === 1) {
    platforms = platforms.filter((p) => p.platform_abbrev === 'MLBB');
  }

  return platforms ? (
    <ul className="flex list-none gap-12 md:flex-col md:gap-3 lg:flex-row">
      <PlatformLinks platforms={platforms} />
    </ul>
  ) : null;
}

export default function SeasonStandingsLayout({
  params: { season_type, season_number },
  children
}: SeasonStandingsLayoutProps) {
  const seasonNumber = parseInt(season_number, 10);
  const seasonType = season_type.charAt(0).toUpperCase() + season_type.slice(1);

  return (
    <>
      <header className="relative border-b border-neutral-200 font-semibold dark:border-neutral-700 md:h-32 lg:h-20">
        <div className="flex w-full flex-col justify-between gap-8 p-4 md:flex-row">
          <div className="flex items-center gap-8">
            <span className="hidden gap-2 lg:flex">
              STAGES <ChevronDoubleRightIcon className="h-auto w-6" />
            </span>
            <Suspense fallback={<Loading />}>
              <StagesComponent seasonType={seasonType} seasonNumber={seasonNumber} />
            </Suspense>
          </div>
          <div>
            <Suspense fallback={<Loading />}>
              <PlatformsComponent seasonNumber={seasonNumber} />
            </Suspense>
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
