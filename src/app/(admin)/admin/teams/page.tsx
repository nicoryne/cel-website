import { getAllTeams } from '@/api';
import AdminTeamsClient from '@/components/admin/AdminTeamsClient';

export default async function AdminTeams() {
  const teamsList = await getAllTeams();

  return (
    <>
      <AdminTeamsClient teamsList={teamsList} />
    </>
  );
}
