import { getAllGamePlatforms } from '@/api';
import AdminPlatformsClient from '@/components/admin/clients/Platforms';

export default async function AdminCharacters() {
  const platforms = await getAllGamePlatforms();

  return (
    <>
      <AdminPlatformsClient platforms={platforms} />
    </>
  );
}
