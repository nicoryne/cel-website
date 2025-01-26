import { getMapCount } from '@/api/maps';
import MapsClientBase from '@/app/(admin)/_ui/clients/maps/base';
import Loading from '@/components/loading';
import { Suspense } from 'react';

export default function AdminMaps() {
  const mapCount = getMapCount();

  return (
    <Suspense fallback={<Loading />}>
      <MapsClientBase mapCount={mapCount} />
    </Suspense>
  );
}
