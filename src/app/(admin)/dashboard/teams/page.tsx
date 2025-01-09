import { getAllTeams } from '@/api/team';
import AdminTeamsClient from '@/components/admin/clients/teams';

export default async function AdminTeams() {
  const teamsList = await getAllTeams();

  return (
    <>
      <AdminTeamsClient teamsList={teamsList} />
    </>
  );
}
