import { getAllGamePlatforms } from '@/api/game-platform';
import AdminPlatformsClient from '@/components/admin/clients/platforms';

export default async function AdminCharacters() {
  const platforms = await getAllGamePlatforms();

  return (
    <>
      <AdminPlatformsClient platforms={platforms} />
    </>
  );
}
