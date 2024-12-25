import { getAllPlayersWithDetails, getAllTeams } from '@/api';
import Image from 'next/image';

export default async function TeamsPage() {
  const teamsList = await getAllTeams();
  const playersList = await getAllPlayersWithDetails();

  const renderedTeams = teamsList.filter(
    (team) => team.school_abbrev !== 'TBD'
  );

  return (
    <main className="mt-24 px-8">
      <div className="min-h-screen">
        {/* Teams */}
        <div></div>
      </div>
    </main>
  );
}
