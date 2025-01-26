'use client';

import { GamePlatform, PlayerFormType, PlayerWithDetails, Team } from '@/lib/types';
import React from 'react';
import Modal, { ModalProps } from '@/components/ui/modal';
import PaginationControls from '@/components/admin/pagination';
import ButtonInsert from '@/app/(admin)/_ui/buttons/button-insert';
import {
  addPlayerToCache,
  fetchPlayersByStringFilter,
  getFilteredPlayers,
  handleInsert
} from '@/app/(admin)/_ui/clients/players/utils';
import { appendPlayerDetails, getPlayersByIndexRange } from '@/api/player';
import InputSearch from '@/components/admin/input-search';
import PlayerCard from '@/app/(admin)/_ui/clients/players/card';

type PlayersClientBaseProps = {
  playerCount: Promise<number | null>;
  platformList: Promise<GamePlatform[]>;
  teamList: Promise<Team[]>;
};

const ITEMS_PER_PAGE = 9;

export default function PlayersClientBase({ playerCount, platformList, teamList }: PlayersClientBaseProps) {
  const processedPlayerCount = React.use(playerCount);
  const processedPlatformList = React.use(platformList);
  const processedTeamList = React.use(teamList);

  const formData = React.useRef<PlayerFormType>();

  const [totalItems, setTotalItems] = React.useState<number>(0);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [cachedPlayers, setCachedPlayers] = React.useState<PlayerWithDetails[]>([]);
  const [modalProps, setModalProps] = React.useState<ModalProps | null>(null);
  const [searchFilter, setSearchFilter] = React.useState<string>('');

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

  const fetchPlayersByRange = async (page: number) => {
    const min = (page - 1) * ITEMS_PER_PAGE;
    const max = min + ITEMS_PER_PAGE;
    const playerList = await getPlayersByIndexRange(min, max);

    playerList.forEach((player) => {
      const playerWithDetails = appendPlayerDetails(processedPlatformList, processedTeamList, player);
      addPlayerToCache(playerWithDetails, setCachedPlayers);
    });
  };

  // Fetch Schedule
  React.useEffect(() => {
    const loadCurrentAndPrefetchNext = async (page: number) => {
      await fetchPlayersByRange(page);

      if (page < totalPages) {
        setTimeout(() => {
          loadCurrentAndPrefetchNext(page + 1);
        }, 500);
      }
    };

    loadCurrentAndPrefetchNext(1);
  }, [totalPages]);

  // Filter if not in cache
  const fetchPlayersByName = async () => {
    const player = await fetchPlayersByStringFilter(searchFilter, processedPlatformList, processedTeamList);

    if (player) {
      addPlayerToCache(player, setCachedPlayers);
    }
  };

  const paginatedPlayers = React.useMemo(() => {
    const filtered = getFilteredPlayers(cachedPlayers, searchFilter);

    if (searchFilter.length > 0) {
      fetchPlayersByName();
    }

    const min = (currentPage - 1) * ITEMS_PER_PAGE;
    const max = min + ITEMS_PER_PAGE;

    return filtered.slice(min, max);
  }, [cachedPlayers, currentPage, searchFilter]);

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
            {paginatedPlayers.map((player, index) => (
              <li key={index}>
                <PlayerCard
                  player={player}
                  setModalProps={setModalProps}
                  setCachedPlayers={setCachedPlayers}
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
