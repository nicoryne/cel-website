import { getLeagueScheduleByTypeNumberStage } from '@/api/league-schedule';
import {
  appendSeriesDetails,
  getSeriesByLeagueScheduleId,
  getSeriesByLeagueScheduleIdAndGamePlatform
} from '@/api/series';
import { Series } from '@/lib/types';
import { useEffect, useState } from 'react';
import GroupstageView from '@/app/(user)/standings/_views/groupstage';
import { getAllTeams } from '@/api/team';
import { getAllGamePlatforms } from '@/api/game-platform';
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
  const platformList = await getAllGamePlatforms();
  const leagueSchedule = await getLeagueScheduleByTypeNumberStage(
    season_type.charAt(0).toUpperCase() + season_type.slice(1),
    parseInt(season_number, 10),
    league_stage.charAt(0).toUpperCase() + league_stage.slice(1)
  );

  if (!leagueSchedule) {
    redirect('/not-found');
  }

  const platform_id =
    platformList.find((p) => p.platform_abbrev.toLowerCase() === platform)?.id || platform;

  const seriesList = await getSeriesByLeagueScheduleIdAndGamePlatform(
    leagueSchedule?.id || '',
    platform_id
  );

  return (
    <main className="h-full min-h-[80vh] bg-background shadow-md">
      <div className="overflow-x-scroll">
        {league_stage === 'groupstage' && (
          <GroupstageView seriesList={seriesList} teamsList={teamsList} />
        )}

        {league_stage === 'play-ins' && (
          <PlayinsView seriesList={seriesList} teamsList={teamsList} />
        )}

        {league_stage === 'play-offs' && (
          <PlayoffsView seriesList={seriesList} teamsList={teamsList} />
        )}
      </div>
    </main>
  );
}
