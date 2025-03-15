import { getAllGamePlatforms } from '@/services/game-platform';
import { getAllLeagueSchedules } from '@/services/league-schedule';
import { getAllSeries } from '@/services/series';
import { getAllTeams } from '@/services/team';
import MlbbMultiStepBase from '@/app/(admin)/dashboard/add-match/mlbb/_components/base';

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
