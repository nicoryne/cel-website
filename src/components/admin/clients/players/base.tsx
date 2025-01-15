'use client';

import { Player, PlayerFormType, PlayerWithDetails } from '@/lib/types';
import React from 'react';
import Modal, { ModalProps } from '@/components/modal';
import PaginationControls from '@/components/admin/pagination';
import ButtonInsert from '@/components/admin/buttons/button-insert';
import { addPlatformToCache, handleInsert } from '@/components/admin/clients/players/utils';
import GamePlatformsCard from '@/components/admin/clients/players/card';
import { getGamePlatformsByIndexRange } from '@/api/game-platform';

type PlayersClientBaseProps = {
  playerCount: Promise<number | null>;
};

const ITEMS_PER_PAGE = 10;

export default function PlayersClientBase({ playerCount }: PlayersClientBaseProps) {
  const processedPlayerCount = React.use(playerCount);
  const formData = React.useRef<PlayerFormType>();

  const [totalItems, setTotalItems] = React.useState<number>(0);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [cachedPlayers, setCachedPlayers] = React.useState<PlayerWithDetails[]>([]);
  const [modalProps, setModalProps] = React.useState<ModalProps | null>(null);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Setting Total Items & Pages
  React.useEffect(() => {
    if (processedPlayerCount) {
      setTotalItems(processedPlayerCount);
    }

    if (processedPlayerCount && cachedPlayers.length > processedPlayerCount) {
      setTotalItems(cachedPlayers.length);
    }
  }, [processedPlayerCount, cachedPlayers]);

  const fetchGamePlatformsByPage = async (page: number) => {
    const min = (page - 1) * ITEMS_PER_PAGE;
    const max = min + ITEMS_PER_PAGE;
    const platformList = await getGamePlatformsByIndexRange(min, max);

    platformList.forEach((platform) => {
      addPlatformToCache(platform, setCachedPlayers);
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

    return cachedPlayers.slice(min, max);
  }, [cachedPlayers, currentPage]);

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
        <InputSearch setSearchFilter={setSearchFilter} />
        <ButtonInsert onInsert={() => handleInsert(setModalProps, formData, setCachedPlayers)} />
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
                  setCachedPlatforms={setCachedPlayers}
                  formData={formData}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* End of Content */}
      <PaginationControls currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
    </>
  );
}
