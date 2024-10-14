import Navbar from '@/components/navbar';
import StartPage from '@/components/startpage';
import { getAllSeriesWithDetails } from '../actions/fetch-series';

export default async function Home() {
  const seriesList = await getAllSeriesWithDetails();

  console.log(seriesList);

  return (
    <div>
      <Navbar />

      <StartPage seriesList={seriesList} />
    </div>
  );
}
