import { getMapCount } from '@/services/maps';
import MapsClientBase from '@/app/(admin)/dashboard/maps/_components/base';
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
