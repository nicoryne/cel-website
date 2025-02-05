import { getAllGamePlatforms } from '@/api/game-platform';
import StatisticsBase from '@/app/(user)/statistics/_components/statistics-base';

interface StatisticsPageProps {
  params: {
    platform: string;
  };
}

export default function StatisticsPage({ params: { platform } }: StatisticsPageProps) {
  return (
    <main>
      <p>ra!</p>
    </main>
  );
}
