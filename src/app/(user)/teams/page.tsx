import { getAllPlayersWithDetails, getAllTeams } from '@/api';

export default async function TeamsPage() {
  const teamsList = await getAllTeams();
  const playersList = await getAllPlayersWithDetails();

  return (
    <main>
      <p>Teams Page</p>
    </main>
  );
}
