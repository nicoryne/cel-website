import Navbar from '@/components/navbar';
import StartPage from '@/components/startpage';
import { getAllSeriesWithDetails } from '../actions/fetch-series';

export default async function Home() {
  const seriesList = await getAllSeriesWithDetails();

  console.log(seriesList);

  return (
    <div className="overflow-hidden">
      <Navbar />

      <StartPage seriesList={seriesList} />
    </div>
  );
}
