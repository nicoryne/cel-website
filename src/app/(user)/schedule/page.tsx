import { getAllSeriesWithDetails } from '@/api/series/seriesApi';
import ScheduleSection from '@/components/ScheduleSection';
import { getAllGamePlatforms } from '@/api/platform/platformApi';

export default async function SchedulePage() {
  const seriesList = await getAllSeriesWithDetails();
  const gamePlatformList = await getAllGamePlatforms();

  return (
    <>
      <ScheduleSection
        seriesList={seriesList}
        gamePlatformList={gamePlatformList}
      />
    </>
  );
}
