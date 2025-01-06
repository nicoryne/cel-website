import { Suspense } from 'react';
import ScheduleBase from '@/components/schedule/schedule-base';
import Loading from '@/components/loading';
import { getAllGamePlatforms } from '@/api/game-platform';
import { getAllSeries, getAllSeriesWithDetails } from '@/api/series';
import { GamePlatform, SeriesWithDetails } from '@/lib/types';
import { FilterState } from '@/components/schedule/types';

export default function SchedulePage() {
  const series = getAllSeriesWithDetails();
  const gamePlatforms = getAllGamePlatforms();

  return (
    <main className="mx-auto px-8 pb-8 md:w-[800px] lg:w-[1100px]">
      <Suspense fallback={<Loading />}>
        <ScheduleBase series={series} gamePlatforms={gamePlatforms} />
      </Suspense>
    </main>
  );
}
