import { getAllGamePlatforms } from '@/api/game-platform';
import { getAllLeagueSchedules } from '@/api/league-schedule';
import { getPlayerCount } from '@/api/player';
import { getAllTeams } from '@/api/team';
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
