import { getAllGamePlatforms } from '@/api/game-platform';
import { getAllLeagueSchedules } from '@/api/league-schedule';
import { getAllSeries } from '@/api/series';
import { getAllTeams } from '@/api/team';
import MlbbMultiStepBase from '@/app/(admin)/_ui/clients/add-match/mlbb/base';

export default function AddMatchMlbbPage() {
  const seriesList = getAllSeries();
  const platformList = getAllGamePlatforms();
  const teamList = getAllTeams();
  const scheduleList = getAllLeagueSchedules();

  return (
    <>
      <MlbbMultiStepBase
        seriesList={seriesList}
        platformList={platformList}
        teamsList={teamList}
        scheduleList={scheduleList}
      />
    </>
  );
}
