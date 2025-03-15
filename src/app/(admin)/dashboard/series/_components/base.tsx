'use client';

import { GamePlatform, LeagueSchedule, SeriesFormType, SeriesWithDetails, Team } from '@/lib/types';
import React from 'react';
import Modal, { ModalProps } from '@/components/ui/modal';
import PaginationControls from '@/components/admin/pagination';
import ButtonInsert from '@/app/(admin)/dashboard/_components/button-insert';
import { addSeriesToCache, handleInsert } from '@/app/(admin)/dashboard/series/_components/utils';
import SeriesCard from '@/app/(admin)/dashboard/series/_components/card';
import { appendSeriesDetails, getSeriesByIndexRange } from '@/services/series';

type SeriesClientBaseProps = {
  seriesCount: Promise<number | null>;
  teamList: Promise<Team[]>;
  platformList: Promise<GamePlatform[]>;
  leagueScheduleList: Promise<LeagueSchedule[]>;
};

const ITEMS_PER_PAGE = 12;

export default function SeriesClientBase({
  seriesCount,
  teamList,
  platformList,
  leagueScheduleList
}: SeriesClientBaseProps) {
  const processedSeriesCount = React.use(seriesCount);
  const processedTeamList = React.use(teamList);
  const processedPlatformList = React.use(platformList);
  const processedLeagueScheduleList = React.use(leagueScheduleList);

  const formData = React.useRef<SeriesFormType>();

  const [totalItems, setTotalItems] = React.useState<number>(0);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [cachedSeries, setCachedSeries] = React.useState<SeriesWithDetails[]>([]);
  const [modalProps, setModalProps] = React.useState<ModalProps | null>(null);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Setting Total Items & Pages
  React.useEffect(() => {
    if (processedSeriesCount) {
      setTotalItems(processedSeriesCount);
    }

    if (processedSeriesCount && cachedSeries.length > processedSeriesCount) {
      setTotalItems(cachedSeries.length);
    }
  }, [processedSeriesCount, cachedSeries]);

  const fetchSeriesByPage = async (page: number) => {
    const min = (page - 1) * ITEMS_PER_PAGE;
    const max = min + ITEMS_PER_PAGE;
    const seriesList = await getSeriesByIndexRange(min, max);

    seriesList.forEach((series) => {
      const processedSeries = appendSeriesDetails(
        processedPlatformList,
        processedTeamList,
        processedLeagueScheduleList,
        series
      );
      addSeriesToCache(processedSeries, setCachedSeries);
    });
  };

  // Fetch Schedule
  React.useEffect(() => {
    const loadCurrentAndPrefetchNext = async (page: number) => {
      await fetchSeriesByPage(page);

      if (page < totalPages) {
        setTimeout(() => {
          loadCurrentAndPrefetchNext(page + 1);
        }, 500);
      }
    };

    loadCurrentAndPrefetchNext(1);
  }, [totalPages]);

  const paginatedSeries = React.useMemo(() => {
    const min = (currentPage - 1) * ITEMS_PER_PAGE;
    const max = min + ITEMS_PER_PAGE;

    return cachedSeries.slice(min, max);
  }, [cachedSeries, currentPage]);

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
        <ButtonInsert
          onInsert={() =>
            handleInsert(
              setModalProps,
              formData,
              processedPlatformList,
              processedTeamList,
              processedLeagueScheduleList,
              setCachedSeries
            )
          }
        />
      </aside>
      {/* End of Controls */}

      {/* Content */}
      <div className="h-[80vh] w-full px-8">
        <div className="relative overflow-x-auto border-2 border-neutral-800 sm:rounded-lg">
          {/* Platform Cards */}
          <ul className="grid grid-cols-1 gap-8 p-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {paginatedSeries.map((series, index) => (
              <li key={index}>
                <SeriesCard
                  series={series}
                  setModalProps={setModalProps}
                  setCachedSeries={setCachedSeries}
                  formData={formData}
                  platformList={processedPlatformList}
                  teamList={processedTeamList}
                  leagueScheduleList={processedLeagueScheduleList}
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
