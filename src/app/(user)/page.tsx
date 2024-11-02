import { getAllSeriesWithDetails } from '@/api/series/seriesApi';
import Navbar from '@/components/Navbar';
import HomeSection from '@/components/HomeSection';
import { getAllGamePlatforms } from '@/api/platform/platformApi';

export default async function Home() {
  const seriesList = await getAllSeriesWithDetails();
  const gamePlatformList = await getAllGamePlatforms();

  return (
    <>
      <HomeSection
        seriesList={seriesList}
        gamePlatformList={gamePlatformList}
      />
    </>
  );
}
