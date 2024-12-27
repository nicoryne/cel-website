import { getAllCharactersWithDetails, getAllGamePlatforms } from '@/api';
import AdminCharactersClient from '@/components/admin/clients/Characters';

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
