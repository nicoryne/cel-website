import { getAllLeagueSchedules } from '@/api/league-schedule';
import { getAllGamePlatforms } from '@/api/game-platform';
import { getAllSeriesWithDetails } from '@/api/series';
import { getAllTeams } from '@/api/team';
import AdminSeriesClient from '@/components/admin/clients/series';

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
