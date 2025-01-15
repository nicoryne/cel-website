import { getScheduleCount } from '@/api/league-schedule';
import ScheduleClientBase from '@/components/admin/clients/league-schedule/base';
import Loading from '@/components/loading';
import { Suspense } from 'react';

export default function AdminLeagueSchedule() {
  const scheduleCount = getScheduleCount();

  return (
    <>
      <Suspense fallback={<Loading />}>
        <ScheduleClientBase scheduleCount={scheduleCount} />
      </Suspense>
    </>
  );
}
