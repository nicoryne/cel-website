import { getAllGamePlatforms, getAllTeams } from '@/api';
import { getAllPlayersWithDetails } from '@/api/player/playerApi';
import AdminPlayersClient from '@/components/admin/AdminPlayersClient';

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
