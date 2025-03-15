import { getAllGamePlatforms, getGamePlatformCount } from '@/services/game-platform';
import GamePlatformsClientBase from '@/app/(admin)/dashboard/platforms/_components/base';
import Loading from '@/components/loading';
import { Suspense } from 'react';

export default function AdminGamePlatforms() {
  const platformCount = getGamePlatformCount();

  return (
    <>
      <Suspense fallback={<Loading />}>
        <GamePlatformsClientBase platformCount={platformCount} />
      </Suspense>
    </>
  );
}
