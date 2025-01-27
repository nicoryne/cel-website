import { getLeagueStageByTypeAndNumber } from '@/api/league-schedule';
import { ChevronDoubleRightIcon } from '@heroicons/react/20/solid';
import StageLinks from '@/app/(user)/standings/_ui/stage-links';

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

  return (
    <div className="w-full md:py-4">
      <header className="h-24 border-b-2 border-neutral-200 px-4 py-8 font-semibold dark:border-neutral-700">
        <div className="flex gap-8">
          <span className="hidden items-center gap-2 md:flex">
            STAGES <ChevronDoubleRightIcon className="h-auto w-6" />
          </span>
          {stages && (
            <ul className="flex list-none gap-6">
              <StageLinks stages={stages} />
            </ul>
          )}
        </div>
      </header>
      {children}
    </div>
  );
}
