import { getAllLeagueSchedules } from '@/api/league-schedule';
import { getAllGamePlatforms } from '@/api/game-platform';
import { getAllTeams } from '@/api/team';
import { getSeriesCount } from '@/api/series';
import { Suspense } from 'react';
import SeriesClientBase from '@/components/admin/clients/series/base';
import Loading from '@/components/loading';

export default function AdminSeries() {
  const seriesCount = getSeriesCount();
  const teamsList = getAllTeams();
  const scheduleList = getAllLeagueSchedules();
  const platforms = getAllGamePlatforms();

  return (
    <>
      <Suspense fallback={<Loading />}>
        <SeriesClientBase
          seriesCount={seriesCount}
          teamList={teamsList}
          leagueScheduleList={scheduleList}
          platformList={platforms}
        />
      </Suspense>
    </>
  );
}
