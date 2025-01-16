import { getAllGamePlatforms } from '@/api/game-platform';
import { getPlayerCount } from '@/api/player';
import { getAllTeams } from '@/api/team';
import PlayersClientBase from '@/components/admin/clients/players/base';
import { Suspense } from 'react';

export default function AdminPlayers() {
  const playerCount = getPlayerCount();
  const platformList = getAllGamePlatforms();
  const teamList = getAllTeams();

  return (
    <>
      <Suspense>
        <PlayersClientBase playerCount={playerCount} platformList={platformList} teamList={teamList} />
      </Suspense>
    </>
  );
}
