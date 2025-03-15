import { getTeamCount } from '@/services/team';
import TeamsClientBase from '@/app/(admin)/dashboard/teams/_components/base';
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
