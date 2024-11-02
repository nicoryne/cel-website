import { getAllSeriesWithDetails } from '../actions/fetch-series';
import Navbar, { NavigationLink } from '@/components/Navbar';
import HomeSection from '@/components/HomeSection';
import { getAllGamePlatforms } from '@/actions/fetch-platform';

const navigationLinks: NavigationLink[] = [
  { text: 'Schedule', href: '/schedule' },
  { text: 'Statistics', href: '/statistics' },
  { text: 'Standing', href: '/standing' }
];

export default async function Home() {
  const seriesList = await getAllSeriesWithDetails();
  const gamePlatformList = await getAllGamePlatforms();

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
