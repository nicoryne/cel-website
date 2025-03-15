'use client';

import { Partner, PartnerFormType } from '@/lib/types';
import React from 'react';
import Modal, { ModalProps } from '@/components/ui/modal';
import PaginationControls from '@/components/admin/pagination';
import ButtonInsert from '@/app/(admin)/dashboard/_components/button-insert';
import {
  addPartnerToCache,
  handleInsert
} from '@/app/(admin)/dashboard/partners/_components/utils';
import { getPartnersByIndexRange } from '@/services/partner';
import PartnersCard from '@/app/(admin)/dashboard/partners/_components/card';

interface PartnersClientBaseProps {
  partnerCount: Promise<number | null>;
}

const ITEMS_PER_PAGE = 9;

export default function PartnersClientBase({ partnerCount }: PartnersClientBaseProps) {
  const processedPartnerCount = React.use(partnerCount);
  const formData = React.useRef<PartnerFormType>();

  const [totalItems, setTotalItems] = React.useState<number>(0);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [cachedPartners, setCachedPartners] = React.useState<Partner[]>([]);
  const [modalProps, setModalProps] = React.useState<ModalProps | null>(null);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Setting Total Items & Pages
  React.useEffect(() => {
    if (processedPartnerCount) {
      setTotalItems(processedPartnerCount);
    }

    if (processedPartnerCount && cachedPartners.length > processedPartnerCount) {
      setTotalItems(cachedPartners.length);
    }
  }, [processedPartnerCount, cachedPartners]);

  const fetchPartnersByPage = async (page: number) => {
    const min = (page - 1) * ITEMS_PER_PAGE;
    const max = min + ITEMS_PER_PAGE;
    const partnerList = await getPartnersByIndexRange(min, max);

    partnerList.forEach((partner) => {
      addPartnerToCache(partner, setCachedPartners);
    });
  };

  // Fetch Schedule
  React.useEffect(() => {
    const loadCurrentAndPrefetchNext = async (page: number) => {
      await fetchPartnersByPage(page);

      if (page < totalPages) {
        setTimeout(() => {
          loadCurrentAndPrefetchNext(page + 1);
        }, 500);
      }
    };

    loadCurrentAndPrefetchNext(1);
  }, [totalPages]);

  const pagintedPartners = React.useMemo(() => {
    const min = (currentPage - 1) * ITEMS_PER_PAGE;
    const max = min + ITEMS_PER_PAGE;

    return cachedPartners.slice(min, max);
  }, [cachedPartners, currentPage]);

  return (
    <>
      {/* Modal*/}
      {modalProps && (
        <Modal
          title={modalProps.title}
          type={modalProps.type}
          message={modalProps.message}
          onCancel={modalProps.onCancel}
          onConfirm={modalProps.onConfirm}
          children={modalProps.children}
        />
      )}
      {/* Series Control Panel*/}
      <aside className="flex place-items-center justify-between gap-16 bg-transparent p-4 px-8">
        {/* Insert */}
        <ButtonInsert onInsert={() => handleInsert(setModalProps, formData, setCachedPartners)} />
      </aside>
      {/* End of Controls */}

      {/* Content */}
      <div className="h-[80vh] w-full px-8">
        <div className="relative overflow-x-auto border-2 border-neutral-800 sm:rounded-lg">
          {/* Platform Cards */}
          <ul className="grid grid-cols-1 gap-8 p-8 sm:grid-cols-2 md:grid-cols-3">
            {pagintedPartners.map((partner, index) => (
              <li key={index}>
                <PartnersCard
                  partner={partner}
                  setModalProps={setModalProps}
                  setCachedPartners={setCachedPartners}
                  formData={formData}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* End of Content */}
      <PaginationControls
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </>
  );
}
