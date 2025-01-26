import { getAllGamePlatforms, getGamePlatformCount } from '@/api/game-platform';
import GamePlatformsClientBase from '@/app/(admin)/_ui/clients/platforms/base';
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
