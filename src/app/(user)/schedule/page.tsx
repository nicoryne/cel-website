import { getAllSeriesWithDetails } from '@/api/series/seriesApi';
import { getAllGamePlatforms } from '@/api/platform/platformApi';
import dynamic from 'next/dynamic';

const ScheduleSection = dynamic(
  () => import('@/components/schedule/ScheduleSection')
);

export default async function SchedulePage() {
  const seriesList = await getAllSeriesWithDetails();
  const gamePlatformList = await getAllGamePlatforms();

  return (
    <main className="mx-auto px-8 pb-8 md:w-[800px] lg:w-[1100px]">
      <ScheduleSection
        seriesList={seriesList}
        gamePlatformList={gamePlatformList}
      />
    </main>
  );
}
