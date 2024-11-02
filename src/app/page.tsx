import { getAllSeriesWithDetails } from '@/api/series/seriesApi';
import Navbar from '@/components/Navbar';
import HomeSection from '@/components/HomeSection';
import { getAllGamePlatforms } from '@/api/platform/platformApi';

export default async function Home() {
  const seriesList = await getAllSeriesWithDetails();
  const gamePlatformList = await getAllGamePlatforms();

  console.log(seriesList);
  return (
    <>
      <Navbar />

      <main className="mx-auto my-24 flex min-h-fit flex-col p-8 md:w-[1100px]">
        <HomeSection
          seriesList={seriesList}
          gamePlatformList={gamePlatformList}
        />
      </main>
    </>
  );
}
