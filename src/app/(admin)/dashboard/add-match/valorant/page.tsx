import { getAllCharacters } from '@/services/characters';
import { getAllGamePlatforms } from '@/services/game-platform';
import { getAllLeagueSchedules } from '@/services/league-schedule';
import { getAllMaps } from '@/services/maps';
import { getAllSeries } from '@/services/series';
import { getAllTeams } from '@/services/team';
import ValorantMultiStepBase from '@/app/(admin)/dashboard/add-match/valorant/_components/base';

export default function AddMatchValorantPage() {
  const seriesList = getAllSeries();
  const mapList = getAllMaps();
  const platformList = getAllGamePlatforms();
  const teamList = getAllTeams();
  const scheduleList = getAllLeagueSchedules();

  return (
    <>
      <ValorantMultiStepBase
        seriesList={seriesList}
        mapList={mapList}
        platformList={platformList}
        teamsList={teamList}
        scheduleList={scheduleList}
      />
    </>
  );
}
