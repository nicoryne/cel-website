import { getAllGamePlatforms } from '@/api/game-platform';
import { getAllTeams } from '@/api/team';
import { getAllPlayersWithDetails } from '@/api/player';
import AdminPlayersClient from '@/components/admin/clients/players';

export default async function AdminPlayers() {
  const playersList = await getAllPlayersWithDetails();
  const teamsList = await getAllTeams();
  const platforms = await getAllGamePlatforms();

  return (
    <>
      <AdminPlayersClient
        playersList={playersList}
        teamsList={teamsList}
        platforms={platforms}
      />
    </>
  );
}
