import { getAllGamePlatforms } from '@/services/game-platform';
import { getAllLeagueSchedules } from '@/services/league-schedule';
import { getPlayerCount } from '@/services/player';
import { getAllTeams } from '@/services/team';
import PlayersClientBase from '@/app/(admin)/dashboard/players/_components/base';
import { Suspense } from 'react';

export default function AdminPlayers() {
  const playerCount = getPlayerCount();
  const platformList = getAllGamePlatforms();
  const teamList = getAllTeams();
  const scheduleList = getAllLeagueSchedules();

  return (
    <>
      <Suspense>
        <PlayersClientBase
          playerCount={playerCount}
          platformList={platformList}
          teamList={teamList}
          scheduleList={scheduleList}
        />
      </Suspense>
    </>
  );
}
