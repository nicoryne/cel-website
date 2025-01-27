import { getAllCharacters } from '@/api/characters';
import { getAllGamePlatforms } from '@/api/game-platform';
import { getAllLeagueSchedules } from '@/api/league-schedule';
import { getAllMaps } from '@/api/maps';
import { getAllSeries } from '@/api/series';
import { getAllTeams } from '@/api/team';
import ValorantMultiStepBase from '@/app/(admin)/_ui/clients/add-match/valorant/base';

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
