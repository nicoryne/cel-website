import { getAllLeagueSchedules } from '@/services/league-schedule';
import { getAllGamePlatforms } from '@/services/game-platform';
import { getAllTeams } from '@/services/team';
import { getSeriesCount } from '@/services/series';
import { Suspense } from 'react';
import SeriesClientBase from '@/app/(admin)/dashboard/series/_components/base';
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
