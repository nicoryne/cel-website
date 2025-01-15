import { getTeamCount } from '@/api/team';
import TeamsClientBase from '@/components/admin/clients/teams/base';
import Loading from '@/components/loading';
import { Suspense } from 'react';

export default function AdminTeams() {
  const teamCount = getTeamCount();

  return (
    <>
      <Suspense fallback={<Loading />}>
        <TeamsClientBase teamCount={teamCount} />
      </Suspense>
    </>
  );
}
