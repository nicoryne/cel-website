'use client';

import { GamePlatform, GamePlatformFormType } from '@/lib/types';
import React from 'react';
import Modal, { ModalProps } from '@/components/ui/modal';
import PaginationControls from '@/components/admin/pagination';
import ButtonInsert from '@/app/(admin)/dashboard/_components/button-insert';
import {
  addPlatformToCache,
  handleInsert
} from '@/app/(admin)/dashboard/platforms/_components/utils';
import GamePlatformsCard from '@/app/(admin)/dashboard/platforms/_components/card';
import { getGamePlatformsByIndexRange } from '@/services/game-platform';

type GamePlatformsClientBaseProps = {
  platformCount: Promise<number | null>;
};

const ITEMS_PER_PAGE = 10;

export default function GamePlatformsClientBase({ platformCount }: GamePlatformsClientBaseProps) {
  const processedPlatformCount = React.use(platformCount);
  const formData = React.useRef<GamePlatformFormType>();

  const [totalItems, setTotalItems] = React.useState<number>(0);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [cachedPlatforms, setCachedPlatforms] = React.useState<GamePlatform[]>([]);
  const [modalProps, setModalProps] = React.useState<ModalProps | null>(null);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Setting Total Items & Pages
  React.useEffect(() => {
    if (processedPlatformCount) {
      setTotalItems(processedPlatformCount);
    }

    if (processedPlatformCount && cachedPlatforms.length > processedPlatformCount) {
      setTotalItems(cachedPlatforms.length);
    }
  }, [processedPlatformCount, cachedPlatforms]);

  const fetchGamePlatformsByPage = async (page: number) => {
    const min = (page - 1) * ITEMS_PER_PAGE;
    const max = min + ITEMS_PER_PAGE;
    const platformList = await getGamePlatformsByIndexRange(min, max);

    platformList.forEach((platform) => {
      addPlatformToCache(platform, setCachedPlatforms);
    });
  };

  // Fetch Schedule
  React.useEffect(() => {
    const loadCurrentAndPrefetchNext = async (page: number) => {
      await fetchGamePlatformsByPage(page);

      if (page < totalPages) {
        setTimeout(() => {
          loadCurrentAndPrefetchNext(page + 1);
        }, 500);
      }
    };

    loadCurrentAndPrefetchNext(1);
  }, [totalPages]);

  const paginatedPlatforms = React.useMemo(() => {
    const min = (currentPage - 1) * ITEMS_PER_PAGE;
    const max = min + ITEMS_PER_PAGE;

    return cachedPlatforms.slice(min, max);
  }, [cachedPlatforms, currentPage]);

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
        <ButtonInsert onInsert={() => handleInsert(setModalProps, formData, setCachedPlatforms)} />
      </aside>
      {/* End of Controls */}

      {/* Content */}
      <div className="h-[80vh] w-full px-8">
        <div className="relative overflow-x-auto border-2 border-neutral-800 sm:rounded-lg">
          {/* Platform Cards */}
          <ul className="grid grid-cols-1 gap-8 p-8 sm:grid-cols-2 md:grid-cols-3">
            {paginatedPlatforms.map((platform, index) => (
              <li key={index}>
                <GamePlatformsCard
                  platform={platform}
                  setModalProps={setModalProps}
                  setCachedPlatforms={setCachedPlatforms}
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
