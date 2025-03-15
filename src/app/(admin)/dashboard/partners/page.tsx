import { getPartnerCount } from '@/services/partner';
import Loading from '@/components/loading';
import { Suspense } from 'react';
import PartnersClientBase from './_components/base';

export default function AdminPartners() {
  const partnerCount = getPartnerCount();

  return (
    <>
      <Suspense fallback={<Loading />}>
        <PartnersClientBase partnerCount={partnerCount} />
      </Suspense>
    </>
  );
}
