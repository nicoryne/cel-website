import { Suspense } from 'react';
import ScheduleBase from '@/components/schedule/schedule-base';
import Loading from '@/components/loading';
import { getAllGamePlatforms } from '@/api/game-platform';
import { getSeriesByIndexRange } from '@/api/series';
import { getAllTeams } from '@/api/team';
import { getAllLeagueSchedules } from '@/api/league-schedule';

export default function SchedulePage() {
  const series = getSeriesByIndexRange(0, 100);
  const platformList = getAllGamePlatforms();
  const teamList = getAllTeams();
  const leagueScheduleList = getAllLeagueSchedules();

  return (
    <main className="mx-auto px-8 pb-8 md:w-[800px] lg:w-[1100px]">
      <Suspense fallback={<Loading />}>
        <ScheduleBase
          series={series}
          teamList={teamList}
          platformList={platformList}
          leagueScheduleList={leagueScheduleList}
        />
      </Suspense>
    </main>
  );
}
