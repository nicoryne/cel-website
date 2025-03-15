import { getLeagueScheduleByTypeNumberStage } from '@/services/league-schedule';
import { getSeriesByLeagueScheduleIdAndGamePlatform } from '@/services/series';
import GroupstageView from '@/app/(user)/standings/_views/groupstage';
import { getAllTeams } from '@/services/team';
import { getAllGamePlatforms, getGamePlatformByAbbrev } from '@/services/game-platform';
import { redirect } from 'next/navigation';
import PlayinsView from '@/app/(user)/standings/_views/playins';
import PlayoffsView from '@/app/(user)/standings/_views/playoffs';

interface StandingsPageProps {
  params: {
    season_type: string;
    season_number: string;
    league_stage: string;
    platform: string;
  };
}

export default async function StandingsPage({
  params: { season_type, season_number, league_stage, platform }
}: StandingsPageProps) {
  const teamsList = await getAllTeams();
  const matchedPlatform = await getGamePlatformByAbbrev(platform.toUpperCase());
  const leagueSchedule = await getLeagueScheduleByTypeNumberStage(
    season_type.charAt(0).toUpperCase() + season_type.slice(1),
    parseInt(season_number, 10),
    league_stage.charAt(0).toUpperCase() + league_stage.slice(1)
  );

  if (!leagueSchedule || !matchedPlatform) {
    redirect('/not-found');
  }

  const seriesList = await getSeriesByLeagueScheduleIdAndGamePlatform(
    leagueSchedule?.id || '',
    matchedPlatform?.id || ''
  );

  return (
    <main className="min-h-screen bg-background shadow-md">
      {league_stage === 'groupstage' && (
        <GroupstageView
          seriesList={seriesList}
          teamsList={teamsList}
          matchedPlatform={matchedPlatform}
          leagueSchedule={leagueSchedule}
        />
      )}

      {league_stage === 'play-ins' && (
        <PlayinsView
          seriesList={seriesList}
          teamsList={teamsList}
          matchedPlatform={matchedPlatform}
          leagueSchedule={leagueSchedule}
        />
      )}

      {league_stage === 'play-offs' && (
        <PlayoffsView seriesList={seriesList} teamsList={teamsList} />
      )}
    </main>
  );
}
