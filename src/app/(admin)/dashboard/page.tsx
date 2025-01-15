import { getCharactersCount } from '@/api/characters';

export default async function AdminHome() {
  const characterCount = await getCharactersCount();

  return (
    <>
      <h1>Admin Home</h1>
      <p>This is Admin Home</p>
      <p>{characterCount} Test</p>
    </>
  );
}
