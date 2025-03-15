import { getScheduleCount } from '@/services/league-schedule';
import ScheduleClientBase from '@/app/(admin)/dashboard/schedule/_components/base';
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
