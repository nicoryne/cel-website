import { Suspense } from 'react';
import ScheduleBase from '@/app/(user)/schedule/_components/schedule-base';
import Loading from '@/components/loading';
import { getAllGamePlatforms } from '@/services/game-platform';
import { getSeriesByIndexRange } from '@/services/series';
import { getAllTeams } from '@/services/team';
import { getAllLeagueSchedules } from '@/services/league-schedule';

export default function SchedulePage() {
  const series = getSeriesByIndexRange(0, 200);
  const platformList = getAllGamePlatforms();
  const teamList = getAllTeams();
  const leagueScheduleList = getAllLeagueSchedules();

  return (
    <div className="mx-auto px-8 pb-8 md:w-[800px] lg:w-[1100px]">
      <Suspense fallback={<Loading />}>
        <ScheduleBase
          series={series}
          teamList={teamList}
          platformList={platformList}
          leagueScheduleList={leagueScheduleList}
        />
      </Suspense>
    </div>
  );
}
