'use client';

import { GamePlatform, LeagueSchedule, PlayerFormType, PlayerWithDetails, Team } from '@/lib/types';
import React from 'react';
import Modal, { ModalProps } from '@/components/ui/modal';
import PaginationControls from '@/components/admin/pagination';
import ButtonInsert from '@/app/(admin)/dashboard/_components/button-insert';
import {
  addPlayerToCache,
  fetchPlayersByStringFilter,
  getFilteredPlayers,
  handleDelete,
  handleInsert,
  handleUpdate
} from '@/app/(admin)/dashboard/players/_components/utils';
import { appendPlayerDetails, getPlayersByIndexRange } from '@/services/player';
import InputSearch from '@/components/admin/input-search';
import Image from 'next/image';
import ButtonUpdate from '@/app/(admin)/dashboard/_components/button-update';
import ButtonDelete from '@/app/(admin)/dashboard/_components/button-delete';

type PlayersClientBaseProps = {
  playerCount: Promise<number | null>;
  platformList: Promise<GamePlatform[]>;
  teamList: Promise<Team[]>;
  scheduleList: Promise<LeagueSchedule[]>;
};

const ITEMS_PER_PAGE = 8;

export default function PlayersClientBase({
  playerCount,
  platformList,
  teamList,
  scheduleList
}: PlayersClientBaseProps) {
  const processedPlayerCount = React.use(playerCount);
  const processedPlatformList = React.use(platformList);
  const processedTeamList = React.use(teamList);
  const processedScheduleList = React.use(scheduleList);

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

  const leagueSchedules: Record<string, LeagueSchedule[]> = processedScheduleList.reduce<
    Record<string, LeagueSchedule[]>
  >(
    (acc, s) => {
      const key = `${s.season_type.startsWith('Pre') ? 'PS' : 'S'}${s.season_number}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    },
    {} as Record<string, LeagueSchedule[]>
  );

  const fetchPlayersByRange = async (page: number) => {
    const min = (page - 1) * ITEMS_PER_PAGE;
    const max = min + ITEMS_PER_PAGE;
    const playerList = await getPlayersByIndexRange(min, max);

    playerList.forEach((player) => {
      const playerWithDetails = appendPlayerDetails(
        processedPlatformList,
        processedTeamList,
        player
      );
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
    const player = await fetchPlayersByStringFilter(
      searchFilter,
      processedPlatformList,
      processedTeamList
    );

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
        <ButtonInsert
          onInsert={() =>
            handleInsert(
              setModalProps,
              formData,
              setCachedPlayers,
              processedPlatformList,
              processedTeamList,
              leagueSchedules
            )
          }
        />
      </aside>
      {/* End of Controls */}

      {/* Content */}
      <div className="h-[80vh] w-full px-8">
        <div className="relative overflow-x-auto border-2 border-neutral-800 sm:rounded-lg">
          <table className="w-full table-fixed">
            <thead className="bg-neutral-900">
              <tr className="text-left">
                <th scope="col" className="px-4 py-6">
                  #
                </th>
                <th scope="col" className="px-4 py-6">
                  Player
                </th>
                <th scope="col" className="px-4 py-6 text-center">
                  Game
                </th>
                <th scope="col" className="px-8 py-6 text-center">
                  School
                </th>
                <th scope="col" className="px-8 py-6">
                  Role
                </th>
                <th scope="col" className="px-8 py-6">
                  Seasons
                </th>
                <th scope="col" className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedPlayers.map((player, index) => (
                <tr className="border-b-2 border-neutral-900 text-left" key={index}>
                  <td className="whitespace-nowrap px-4 py-3 font-thin">
                    {(index + 1 + (currentPage - 1) * ITEMS_PER_PAGE).toString().padStart(2, '0')}
                  </td>
                  <td className="flex flex-col gap-4 px-4 py-3">
                    <span className="font-bold">{player.ingame_name}</span>
                    <span className="text-xs text-neutral-400">
                      {player.first_name} {player.last_name}
                    </span>
                  </td>
                  <td className="px-8 py-3">
                    <Image
                      src={player.platform?.logo_url!}
                      alt={`${player.platform?.platform_abbrev} Logo`}
                      className="mx-auto h-auto w-8"
                      height={64}
                      width={64}
                    />
                  </td>
                  <td className="px-8 py-3">
                    <Image
                      src={player.team?.logo_url!}
                      alt={`${player.team?.school_abbrev} Logo`}
                      className="mx-auto h-auto w-8"
                      height={64}
                      width={64}
                    />
                  </td>

                  <td className="px-8 py-3 text-sm">{player.roles.join(', ')}</td>
                  <td className="px-8 py-3 text-sm">
                    {Object.entries(leagueSchedules)
                      .map(([season, schedules]) => {
                        const scheduleIds = schedules.map((s) => s.id);
                        const playerLeagues = player.league_schedules?.map((s) => s) || [];

                        const hasMatchingSchedule = playerLeagues.some((schedule) =>
                          scheduleIds.includes(schedule.league_schedule_id)
                        );

                        return hasMatchingSchedule ? season : null;
                      })
                      .filter(Boolean)
                      .join(', ')}
                  </td>

                  <td className="px-2 py-3">
                    <div className="flex gap-8">
                      <ButtonUpdate
                        onUpdate={() =>
                          handleUpdate(
                            setModalProps,
                            formData,
                            player,
                            setCachedPlayers,
                            processedPlatformList,
                            processedTeamList,
                            leagueSchedules
                          )
                        }
                      />
                      <ButtonDelete
                        onDelete={() => handleDelete(setModalProps, player, setCachedPlayers)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
