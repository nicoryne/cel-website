'use client';

import { ValorantMap, ValorantMapFormType } from '@/lib/types';
import React from 'react';
import Modal, { ModalProps } from '@/components/ui/modal';
import PaginationControls from '@/components/admin/pagination';
import ButtonInsert from '@/app/(admin)/dashboard/_components/button-insert';
import { addMapToCache, handleInsert } from '@/app/(admin)/dashboard/maps/_components/utils';
import { getMapsByIndexRange } from '@/services/maps';
import MapsCard from '@/app/(admin)/dashboard/maps/_components/card';

type MapsClientBaseProps = {
  mapCount: Promise<number | null>;
};

const ITEMS_PER_PAGE = 12;

export default function MapsClientBase({ mapCount }: MapsClientBaseProps) {
  const processedMapCount = React.use(mapCount);
  const formData = React.useRef<ValorantMapFormType>();

  const [totalItems, setTotalItems] = React.useState<number>(0);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [cachedMaps, setCachedMaps] = React.useState<ValorantMap[]>([]);
  const [modalProps, setModalProps] = React.useState<ModalProps | null>(null);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Setting Total Items & Pages
  React.useEffect(() => {
    if (processedMapCount) {
      setTotalItems(processedMapCount);
    }

    if (processedMapCount && cachedMaps.length > processedMapCount) {
      setTotalItems(cachedMaps.length);
    }
  }, [processedMapCount, cachedMaps]);

  const fetchMapsByPage = async (page: number) => {
    const min = (page - 1) * ITEMS_PER_PAGE;
    const max = min + ITEMS_PER_PAGE;
    const mapList = await getMapsByIndexRange(min, max);

    mapList.forEach((map) => {
      addMapToCache(map, setCachedMaps);
    });
  };

  // Fetch Schedule
  React.useEffect(() => {
    const loadCurrentAndPrefetchNext = async (page: number) => {
      await fetchMapsByPage(page);

      if (page < totalPages) {
        setTimeout(() => {
          loadCurrentAndPrefetchNext(page + 1);
        }, 500);
      }
    };

    loadCurrentAndPrefetchNext(1);
  }, [totalPages]);

  const paginatedMaps = React.useMemo(() => {
    const min = (currentPage - 1) * ITEMS_PER_PAGE;
    const max = min + ITEMS_PER_PAGE;

    return cachedMaps.slice(min, max);
  }, [cachedMaps, currentPage]);

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
        <ButtonInsert onInsert={() => handleInsert(setModalProps, formData, setCachedMaps)} />
      </aside>
      {/* End of Controls */}

      {/* Content */}
      <div className="h-[80vh] w-full px-8">
        <div className="relative overflow-x-auto border-2 border-neutral-800 sm:rounded-lg">
          {/* Platform Cards */}
          <ul className="grid grid-cols-1 gap-8 p-8 sm:grid-cols-2 md:grid-cols-3">
            {paginatedMaps.map((map, index) => (
              <li key={index}>
                <MapsCard
                  map={map}
                  setModalProps={setModalProps}
                  setCachedMaps={setCachedMaps}
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
