import { getAllTeams } from '@/api';
import AdminTeamsClient from '@/components/admin/clients/Teams';

export default async function AdminTeams() {
  const teamsList = await getAllTeams();

  return (
    <>
      <AdminTeamsClient teamsList={teamsList} />
    </>
  );
}
