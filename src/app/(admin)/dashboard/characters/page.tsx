import { getCharactersCount } from '@/services/characters';
import CharactersClientBase from '@/app/(admin)/dashboard/characters/_components/base';
import { Suspense } from 'react';
import Loading from '@/components/loading';
import { getAllGamePlatforms } from '@/services/game-platform';

export default function AdminCharacters() {
  const charactersCount = getCharactersCount();
  const platformList = getAllGamePlatforms();

  return (
    <>
      <Suspense fallback={<Loading />}>
        <CharactersClientBase charactersCount={charactersCount} platformList={platformList} />
      </Suspense>
    </>
  );
}
