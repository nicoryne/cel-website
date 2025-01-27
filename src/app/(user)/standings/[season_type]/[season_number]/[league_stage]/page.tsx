import { getLeagueScheduleByTypeNumberStage } from '@/api/league-schedule';

interface StandingsPageProps {
  params: {
    season_type: string;
    season_number: string;
    league_stage: string;
  };
}

export default async function StandingsPage({
  params: { season_type, season_number, league_stage }
}: StandingsPageProps) {
  const leagueSchedule = await getLeagueScheduleByTypeNumberStage(
    season_type.charAt(0).toUpperCase() + season_type.slice(1),
    parseInt(season_number, 10),
    league_stage.charAt(0).toUpperCase() + league_stage.slice(1)
  );

  return (
    <main className="h-full min-h-[80vh] bg-background shadow-md">
      <div className="overflow-x-scroll"></div>
    </main>
  );
}
