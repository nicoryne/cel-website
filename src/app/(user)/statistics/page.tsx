import { getAllGamePlatforms } from '@/api/game-platform';
import StatisticsBase from '@/app/(user)/statistics/_components/statistics-base';

export default function StatisticsPage() {
  const gamePlatforms = getAllGamePlatforms();

  return (
    <div className="mx-auto mt-24 px-8 pb-8 md:w-[800px] lg:w-[1100px]">
      <StatisticsBase platforms={gamePlatforms} />
    </div>
  );
}
