import { getAllLeagueSchedules } from '@/api/league-schedule';
import AdminLeagueScheduleClient from '@/components/admin/clients/league-schedule';

export default async function AdminLeagueSchedule() {
  const schedules = await getAllLeagueSchedules();

  return (
    <>
      <AdminLeagueScheduleClient schedules={schedules} />
    </>
  );
}
