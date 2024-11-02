import { getAllPlayersWithDetails } from '@/api/player/playerApi';
import AdminPlayersClient from '@/components/admin/AdminPlayersClient';

export default async function AdminPlayers() {
  const playersList = await getAllPlayersWithDetails();
  return (
    <>
      <AdminPlayersClient playersList={playersList} />
    </>
  );
}
