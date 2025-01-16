import { getAllGamePlatforms } from '@/api/game-platform';
import { getAllMaps } from '@/api/maps';
import { getAllSeries } from '@/api/series';
import ValorantMultiStepBase from '@/components/admin/clients/add-match/valorant/base';

export default function AddMatchValorantPage() {
  const seriesList = getAllSeries();
  const mapList = getAllMaps();
  const platformList = getAllGamePlatforms();

  return (
    <>
      <main>
        <ValorantMultiStepBase seriesList={seriesList} mapList={mapList} platformList={platformList} />
      </main>
    </>
  );
}
