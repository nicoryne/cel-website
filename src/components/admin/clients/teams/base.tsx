'use client';

import { TeamFormType, Team } from '@/lib/types';
import React from 'react';
import Modal, { ModalProps } from '@/components/modal';
import PaginationControls from '@/components/admin/pagination';
import ButtonInsert from '@/components/admin/buttons/button-insert';
import { addTeamToCache, handleInsert } from '@/components/admin/clients/teams/utils';
import TeamsCard from '@/components/admin/clients/teams/card';
import { getTeamsByIndexRange } from '@/api/team';

type TeamsClientBaseProps = {
  teamCount: Promise<number | null>;
};

const ITEMS_PER_PAGE = 9;

export default function TeamsClientBase({ teamCount }: TeamsClientBaseProps) {
  const processedTeamCount = React.use(teamCount);
  const formData = React.useRef<TeamFormType>();

  const [totalItems, setTotalItems] = React.useState<number>(0);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [cachedTeams, setCachedTeams] = React.useState<Team[]>([]);
  const [modalProps, setModalProps] = React.useState<ModalProps | null>(null);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Setting Total Items & Pages
  React.useEffect(() => {
    if (processedTeamCount) {
      setTotalItems(processedTeamCount);
    }

    if (processedTeamCount && cachedTeams.length > processedTeamCount) {
      setTotalItems(cachedTeams.length);
    }
  }, [processedTeamCount, cachedTeams]);

  const fetchGamePlatformsByPage = async (page: number) => {
    const min = (page - 1) * ITEMS_PER_PAGE;
    const max = min + ITEMS_PER_PAGE;
    const platformList = await getTeamsByIndexRange(min, max);

    platformList.forEach((platform) => {
      addTeamToCache(platform, setCachedTeams);
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

  const paginedTeams = React.useMemo(() => {
    const min = (currentPage - 1) * ITEMS_PER_PAGE;
    const max = min + ITEMS_PER_PAGE;

    return cachedTeams.slice(min, max);
  }, [cachedTeams, currentPage]);

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
        <ButtonInsert onInsert={() => handleInsert(setModalProps, formData, setCachedTeams)} />
      </aside>
      {/* End of Controls */}

      {/* Content */}
      <div className="h-[80vh] w-full px-8">
        <div className="relative overflow-x-auto border-2 border-neutral-800 sm:rounded-lg">
          {/* Platform Cards */}
          <ul className="grid grid-cols-1 gap-8 p-8 sm:grid-cols-2 md:grid-cols-3">
            {paginedTeams.map((team, index) => (
              <li key={index}>
                <TeamsCard
                  team={team}
                  setModalProps={setModalProps}
                  setCachedTeams={setCachedTeams}
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
