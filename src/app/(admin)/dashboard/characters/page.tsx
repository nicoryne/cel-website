import { getAllGamePlatforms } from '@/api/game-platform';
import { getAllCharactersWithDetails, getCharactersCount } from '@/api/characters';
import CharactersClientBase from '@/components/admin/clients/characters/base';
import { Suspense } from 'react';
import Loading from '@/components/loading';

export default function AdminCharacters() {
  const charactersCount = getCharactersCount();

  return (
    <>
      <Suspense fallback={<Loading />}>
        <CharactersClientBase charactersCount={charactersCount} />
      </Suspense>
    </>
  );
}
