import { getAllGamePlatforms } from '@/api/game-platform';
import { getAllLeagueSchedules } from '@/api/league-schedule';
import { getAllMaps } from '@/api/maps';
import { getAllSeries } from '@/api/series';
import { getAllTeams } from '@/api/team';
import ValorantMultiStepBase from '@/components/admin/clients/add-match/valorant/base';

export default function AddMatchValorantPage() {
  const seriesList = getAllSeries();
  const mapList = getAllMaps();
  const platformList = getAllGamePlatforms();
  const teamList = getAllTeams();
  const scheduleList = getAllLeagueSchedules();

  return (
    <>
      <main>
        <ValorantMultiStepBase
          seriesList={seriesList}
          mapList={mapList}
          platformList={platformList}
          teamsList={teamList}
          scheduleList={scheduleList}
        />
      </main>
    </>
  );
}
