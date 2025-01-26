import { getCharactersCount } from '@/api/characters';
import CharactersClientBase from '@/app/(admin)/_ui/clients/characters/base';
import { Suspense } from 'react';
import Loading from '@/components/loading';
import { getAllGamePlatforms } from '@/api/game-platform';

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
