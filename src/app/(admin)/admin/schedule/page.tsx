import { getAllLeagueSchedules } from '@/api';
import AdminLeagueScheduleClient from '@/components/admin/clients/LeagueSchedule';

export default async function AdminLeagueSchedule() {
  const schedules = await getAllLeagueSchedules();

  return (
    <>
      <AdminLeagueScheduleClient schedules={schedules} />
    </>
  );
}
