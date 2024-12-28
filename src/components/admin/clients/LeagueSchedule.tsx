'use client';

import { LeagueSchedule } from '@/lib/types';
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  CalendarDateRangeIcon
} from '@heroicons/react/20/solid';
import React from 'react';
import Modal, { ModalProps } from '@/components/Modal';
import {
  createLeagueSchedule,
  deleteLeagueSchedule,
  getAllLeagueSchedules,
  updateLeagueSchedule
} from '@/api';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import not_found from '@/../../public/images/not-found.webp';
import LeagueScheduleForm from '@/components/forms/LeagueScheduleForm';

type AdminLeagueScheduleProps = {
  schedules: LeagueSchedule[];
};

export default function AdminLeagueScheduleClient({
  schedules
}: AdminLeagueScheduleProps) {
  const [localSchedulesList, setLocalSchedulesList] =
    React.useState<LeagueSchedule[]>(schedules);

  // Pagination State
  const [paginatedSchedules, setPaginatedSchedules] =
    React.useState<LeagueSchedule[]>(localSchedulesList);

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 9;

  const totalPages = Math.ceil(localSchedulesList.length / itemsPerPage);

  React.useEffect(() => {
    const paginated = localSchedulesList.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    setPaginatedSchedules(paginated);
  }, [localSchedulesList, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Modal
  type FormDataType = {
    start_date: Date;
    end_date: Date;
    league_stage: string;
    season_number: number;
    season_type: string;
  };

  const [modalProps, setModalProps] = React.useState<ModalProps | null>(null);
  const formData = React.useRef<FormDataType>({
    start_date: new Date(),
    end_date: new Date(),
    league_stage: '',
    season_number: 0,
    season_type: ''
  });

  const resetFormData = () => {
    formData.current = {
      start_date: new Date(),
      end_date: new Date(),
      league_stage: '',
      season_number: 0,
      season_type: ''
    };
  };

  const updateSchedulesList = async () => {
    const updatedList = await getAllLeagueSchedules();
    setLocalSchedulesList(updatedList);
    setModalProps(null);
    resetFormData();
  };

  const retrieveProcessedData = async () => {
    let processedData = {
      start_date: formData.current.start_date,
      end_date: formData.current.end_date,
      league_stage: formData.current.league_stage,
      season_number: formData.current.season_number,
      season_type: formData.current.season_type
    };

    return processedData;
  };

  const handleInsertClick = () => {
    setModalProps({
      title: 'Adding New Schedule',
      type: 'info',
      message: 'Fill out the details to add a new schedule.',
      onCancel: () => setModalProps(null),
      onConfirm: async () => {
        const processedData = await retrieveProcessedData();

        await createLeagueSchedule(processedData as {})
          .then(() => {
            setModalProps({
              title: 'Success',
              message: 'Schedule has been successfully added!',
              type: 'success',
              onCancel: () => setModalProps(null)
            });

            setTimeout(async () => {
              updateSchedulesList();
            }, 2000);
          })
          .catch(() => {
            setModalProps({
              title: 'Error',
              message: 'Failed to add schedule. Please try again.',
              type: 'error',
              onCancel: () => setModalProps(null)
            });
          });
      },
      children: <LeagueScheduleForm schedule={null} formData={formData} />
    });
  };

  const handleUpdateClick = (schedule: LeagueSchedule) => {
    setModalProps({
      title: 'Updating Schedule',
      type: 'info',
      message: 'Fill out the details to update schedule.',
      onCancel: () => setModalProps(null),
      onConfirm: async () => {
        const processedData = await retrieveProcessedData();

        await updateLeagueSchedule(schedule.id, processedData as {})
          .then(() => {
            setModalProps({
              title: 'Success',
              message: 'Schedule has been successfully updated!',
              type: 'success',
              onCancel: () => setModalProps(null)
            });

            setTimeout(async () => {
              updateSchedulesList();
            }, 2000);
          })
          .catch(() => {
            setModalProps({
              title: 'Error',
              message: 'Failed to update schedule. Please try again.',
              type: 'error',
              onCancel: () => setModalProps(null)
            });
          });
      },
      children: <LeagueScheduleForm schedule={schedule} formData={formData} />
    });
  };

  const handleDeleteSchedule = (schedule: LeagueSchedule) => {
    setModalProps({
      title: `Deleting Schedule`,
      message:
        'Are you sure you want to delete the following schedule? This action is irreversible.',
      type: 'warning',
      onCancel: () => setModalProps(null),
      onConfirm: async () => {
        try {
          const deleted = await deleteLeagueSchedule(schedule.id);

          updateSchedulesList();

          setModalProps({
            title: 'Success',
            message: `Schedule has been successfully deleted!`,
            type: 'success',
            onCancel: () => setModalProps(null)
          });

          setTimeout(() => {
            setModalProps(null);
          }, 2000);
        } catch {
          setModalProps({
            title: 'Error',
            message: 'Failed to delete schedule. Please try again.',
            type: 'error',
            onCancel: () => setModalProps(null)
          });
        }
      }
    });
  };

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
      <aside className="flex place-items-center justify-end gap-4 bg-neutral-900 p-4">
        {/* Insert */}
        <button
          className="flex place-items-center space-x-2 rounded-md border-2 border-green-700 bg-green-900 px-3 py-1 hover:border-green-600"
          onClick={handleInsertClick}
        >
          <span>
            <PlusIcon className="h-auto w-3 text-green-600" />
          </span>
          <span className="text-xs text-green-100">Insert</span>
        </button>
      </aside>
      {/* End of Controls */}

      {/* Content */}
      <div className="h-[80vh] w-full overflow-x-auto">
        {/* schedule Cards */}
        <ul className="grid grid-cols-1 gap-8 p-8 sm:grid-cols-3 md:grid-cols-4">
          {paginatedSchedules.map((schedule, index) => (
            <li
              className="flex flex-col rounded-md border-2 border-neutral-700 bg-neutral-900 shadow-lg"
              key={index}
            >
              {/* Body */}
              <div className="flex flex-col gap-4 p-8">
                {/* League Schedule Title */}
                <div>
                  <p className="text-xs font-semibold text-neutral-600">
                    League Schedule Title
                  </p>
                  <p className="text-md text-neutral-300">
                    {schedule.season_type} {schedule.season_number} {' - '}{' '}
                    {schedule.league_stage}
                  </p>
                </div>

                {/* Dates */}
                <div className="flex gap-4">
                  <CalendarDateRangeIcon className="w-4 text-neutral-400" />
                  <time className="text-neutral-500">
                    {new Date(schedule.start_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric'
                    })}{' '}
                    -{' '}
                    {new Date(schedule.end_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric'
                    })}
                  </time>
                </div>

                <div className="flex place-items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleUpdateClick(schedule)}
                  >
                    <PencilSquareIcon className="h-auto w-4 cursor-pointer text-neutral-400 hover:text-[var(--cel-blue)]" />
                  </button>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleDeleteSchedule(schedule)}
                    >
                      <TrashIcon className="h-auto w-4 text-neutral-400 hover:text-[var(--cel-red)]" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* End of Content */}

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 py-4">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className={`rounded px-3 py-1 ${
            currentPage === 1
              ? 'bg-neutral-700 text-neutral-500'
              : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`rounded px-3 py-1 ${
              page === currentPage
                ? 'bg-[var(--cel-blue)] text-white'
                : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className={`rounded px-3 py-1 ${
            currentPage === totalPages
              ? 'bg-neutral-700 text-neutral-500'
              : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          Next
        </button>
      </div>
    </>
  );
}
