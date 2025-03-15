'use client';

import { LeagueSchedule } from '@/lib/types';
import React from 'react';
import Modal, { ModalProps } from '@/components/ui/modal';
import PaginationControls from '@/components/admin/pagination';
import ButtonInsert from '@/app/(admin)/dashboard/_components/button-insert';
import ButtonUpdate from '@/app/(admin)/dashboard/_components/button-update';
import ButtonDelete from '@/app/(admin)/dashboard/_components/button-delete';
import {
  addScheduleToCache,
  handleDelete,
  handleInsert,
  handleUpdate
} from '@/app/(admin)/dashboard/schedule/_components/utils';
import { getLeagueSchedulesByIndexRange } from '@/services/league-schedule';

type ScheduleClientBaseProps = {
  scheduleCount: Promise<number | null>;
};

const ITEMS_PER_PAGE = 10;

export default function ScheduleClientBase({ scheduleCount }: ScheduleClientBaseProps) {
  const processedScheduleCount = React.use(scheduleCount);
  const formData = React.useRef<Partial<LeagueSchedule>>({});

  const [totalItems, setTotalItems] = React.useState<number>(0);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [cachedSchedules, setCachedSchedules] = React.useState<LeagueSchedule[]>([]);
  const [modalProps, setModalProps] = React.useState<ModalProps | null>(null);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Setting Total Items & Pages
  React.useEffect(() => {
    if (processedScheduleCount) {
      setTotalItems(processedScheduleCount);
    }

    if (processedScheduleCount && cachedSchedules.length > processedScheduleCount) {
      setTotalItems(cachedSchedules.length);
    }
  }, [processedScheduleCount, cachedSchedules]);

  const fetchSchedulesByPage = async (page: number) => {
    const min = (page - 1) * ITEMS_PER_PAGE;
    const max = min + ITEMS_PER_PAGE;
    const scheduleList = await getLeagueSchedulesByIndexRange(min, max);

    scheduleList.forEach((schedule) => {
      addScheduleToCache(schedule, setCachedSchedules);
    });
  };

  // Fetch Schedule
  React.useEffect(() => {
    const loadCurrentAndPrefetchNext = async (page: number) => {
      await fetchSchedulesByPage(page);

      if (page < totalPages) {
        setTimeout(() => {
          loadCurrentAndPrefetchNext(page + 1);
        }, 500);
      }
    };

    loadCurrentAndPrefetchNext(1);
  }, [totalPages]);

  const paginatedSchedules = React.useMemo(() => {
    const min = (currentPage - 1) * ITEMS_PER_PAGE;
    const max = min + ITEMS_PER_PAGE;

    return cachedSchedules.slice(min, max);
  }, [cachedSchedules, currentPage]);

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
        <ButtonInsert onInsert={() => handleInsert(setModalProps, formData, setCachedSchedules)} />
      </aside>
      {/* End of Controls */}

      {/* Content */}
      <div className="h-[80vh] w-full px-8">
        <div className="relative overflow-x-auto border-2 border-neutral-800 sm:rounded-lg">
          <table className="w-full table-auto">
            <thead className="bg-neutral-900">
              <tr className="text-left">
                <th scope="col" className="px-4 py-6">
                  #
                </th>
                <th scope="col" className="px-8 py-6">
                  Season Type
                </th>
                <th scope="col" className="px-4 py-6">
                  Season Number
                </th>
                <th scope="col" className="px-6 py-6">
                  Stage
                </th>
                <th scope="col" className="px-8 py-6">
                  Start Date
                </th>
                <th scope="col" className="px-8 py-6">
                  End Date
                </th>
                <th scope="col" className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedSchedules.map((schedule, index) => (
                <tr className="border-b-2 border-neutral-900 text-left" key={index}>
                  <td className="whitespace-nowrap px-4 py-3 font-thin">
                    {(index + 1 + (currentPage - 1) * ITEMS_PER_PAGE).toString().padStart(2, '0')}
                  </td>
                  <td className="px-8 py-3 font-thin">{schedule.season_type}</td>
                  <td className="px-4 py-3 font-thin">{schedule.season_number}</td>
                  <td className="px-6 py-3 font-thin">{schedule.league_stage}</td>
                  <td className="px-6 py-3 font-thin">
                    {new Date(schedule.start_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 font-thin">
                    {new Date(schedule.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex gap-8">
                      <ButtonUpdate
                        onUpdate={() =>
                          handleUpdate(setModalProps, formData, schedule, setCachedSchedules)
                        }
                      />
                      <ButtonDelete
                        onDelete={() => handleDelete(setModalProps, schedule, setCachedSchedules)}
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
