import { getAllGamePlatforms } from '@/api/game-platform';
import { getAllCharactersWithDetails } from '@/api/characters';
import AdminCharactersClient from '@/components/admin/clients/characters';

export default async function AdminCharacters() {
  const charactersList = await getAllCharactersWithDetails();
  const platforms = await getAllGamePlatforms();
  return (
    <>
      <AdminCharactersClient
        charactersList={charactersList}
        platforms={platforms}
      />
    </>
  );
}
