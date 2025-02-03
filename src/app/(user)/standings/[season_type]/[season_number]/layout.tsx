import { getLeagueStageByTypeAndNumber } from '@/api/league-schedule';
import { ChevronDoubleRightIcon } from '@heroicons/react/20/solid';
import StageLinks from '@/app/(user)/standings/_components/stage-links';
import { getAllGamePlatforms } from '@/api/game-platform';

import PlatformLinks from '@/app/(user)/standings/_components/platform-links';

interface SeasonStandingsLayoutProps {
  params: {
    season_type: string;
    season_number: string;
  };
  children: React.ReactNode;
}

export default async function SeasonStandingsLayout({
  params: { season_type, season_number },
  children
}: SeasonStandingsLayoutProps) {
  const seasonNumber = parseInt(season_number, 10);
  const seasonType = season_type.charAt(0).toUpperCase() + season_type.slice(1);
  const stages = await getLeagueStageByTypeAndNumber(seasonType, seasonNumber);
  let platforms = await getAllGamePlatforms();

  if (seasonNumber === 1) {
    platforms = platforms.filter((p) => p.platform_abbrev === 'MLBB');
  }

  return (
    <div className="w-full">
      <header className="relative border-b border-neutral-200 font-semibold dark:border-neutral-700">
        <div className="flex w-full flex-col justify-between gap-8 p-4 md:flex-row">
          <div className="flex items-center gap-8">
            <span className="hidden gap-2 md:flex">
              STAGES <ChevronDoubleRightIcon className="h-auto w-6" />
            </span>
            {stages && (
              <ul className="flex list-none gap-4 xl:gap-6">
                <StageLinks stages={stages} />
              </ul>
            )}
          </div>
          <div>
            {platforms && (
              <ul className="flex list-none gap-12 md:flex-col md:gap-3">
                <PlatformLinks platforms={platforms} />
              </ul>
            )}
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
