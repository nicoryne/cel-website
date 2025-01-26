import { getLeagueStageByTypeAndNumber } from '@/api/league-schedule';
import Link from 'next/link';

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
  const url = `/standings/${season_type}/${seasonNumber}/`;
  return (
    <div className="w-full py-4">
      <header className="border-b-2 border-neutral-200 px-4 py-8 font-semibold dark:border-neutral-700">
        <div className="flex gap-6">
          <span className="font-bold">STAGE:</span>

          {stages && (
            <ul className="flex list-none gap-4">
              {stages.map((stage, index) => (
                <li key={index}>
                  <Link href={`${url}${stage.toLowerCase()}`} className="font-bold uppercase">
                    {stage}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>
      {children}
    </div>
  );
}
