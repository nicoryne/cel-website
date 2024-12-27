import { getAllLeagueSchedules } from '@/api/league';
import { getAllGamePlatforms } from '@/api/platform';
import { getAllSeriesWithDetails } from '@/api/series';
import { getAllTeams } from '@/api/team';
import AdminSeriesClient from '@/components/admin/clients/Series';

export default async function AdminSeries() {
  const seriesList = await getAllSeriesWithDetails();
  const teamsList = await getAllTeams();
  const scheduleList = await getAllLeagueSchedules();
  const platforms = await getAllGamePlatforms();

  return (
    <>
      <AdminSeriesClient
        seriesList={seriesList}
        teamsList={teamsList}
        scheduleList={scheduleList}
        platforms={platforms}
      />
    </>
  );
}
