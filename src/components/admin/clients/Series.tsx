'use client';

import {
  GamePlatform,
  LeagueSchedule,
  SeriesWithDetails,
  Team
} from '@/lib/types';
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/20/solid';
import React from 'react';
import Modal, { ModalProps } from '@/components/modal';
import SeriesForm from '@/components/forms/series-form';
import {
  createSeries,
  deleteSeries,
  getAllSeriesWithDetails,
  updateSeries
} from '@/api/series';
import Image from 'next/image';

type AdminSeriesClientProps = {
  seriesList: SeriesWithDetails[];
  teamsList: Team[];
  scheduleList: LeagueSchedule[];
  platforms: GamePlatform[];
};

export default function AdminSeriesClient({
  seriesList,
  teamsList,
  scheduleList,
  platforms
}: AdminSeriesClientProps) {
  // Local Series List
  const initialList = seriesList.sort(
    (a, b) =>
      new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
  );
  const [localSeriesList, setLocalSeriesList] =
    React.useState<SeriesWithDetails[]>(initialList);

  // Pagination State
  const [paginatedSeries, setPaginatedSeries] =
    React.useState<SeriesWithDetails[]>(localSeriesList);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 12;

  const totalPages = Math.ceil(localSeriesList.length / itemsPerPage);

  React.useEffect(() => {
    const paginated = localSeriesList.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    setPaginatedSeries(paginated);
  }, [localSeriesList, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Filter
  enum filterType {
    ASC,
    DESC
  }

  const sortByDate = (filter: filterType) => {
    const sortedList = [...localSeriesList];
    switch (filter) {
      case filterType.ASC:
        sortedList.sort(
          (a, b) =>
            new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
        break;
      case filterType.DESC:
        sortedList.sort(
          (a, b) =>
            new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
        );
        break;
      default:
        return;
    }
    setLocalSeriesList(sortedList);
  };

  // Modal
  const [modalProps, setModalProps] = React.useState<ModalProps | null>(null);
  const formData = React.useRef({});

  const handleInsertClick = () => {
    setModalProps({
      title: 'Adding New Series',
      type: 'info',
      message: 'Fill out the details to add a new series.',
      onCancel: () => setModalProps(null),
      onConfirm: async () => {
        await createSeries(formData.current)
          .then(() => {
            setModalProps({
              title: 'Success',
              message: 'Series has been successfully added!',
              type: 'success',
              onCancel: () => setModalProps(null)
            });

            setTimeout(async () => {
              const updatedList = await getAllSeriesWithDetails();
              setLocalSeriesList(
                updatedList.sort(
                  (a, b) =>
                    new Date(b.start_time).getTime() -
                    new Date(a.start_time).getTime()
                )
              );
              setModalProps(null);
              formData.current = {};
            }, 500);
          })
          .catch(() => {
            setModalProps({
              title: 'Error',
              message: 'Failed to add series. Please try again.',
              type: 'error',
              onCancel: () => setModalProps(null)
            });
          });
      },
      children: (
        <SeriesForm
          teamsList={teamsList}
          platforms={platforms}
          scheduleList={scheduleList}
          formData={formData}
          series={null}
        />
      )
    });
  };

  const handleUpdateClick = (series: SeriesWithDetails) => {
    setModalProps({
      title: 'Updating Series',
      type: 'info',
      message: 'Fill out the details to update series.',
      onCancel: () => setModalProps(null),
      onConfirm: async () => {
        await updateSeries(series.id, formData.current)
          .then(() => {
            setModalProps({
              title: 'Success',
              message: 'Series has been successfully updated!',
              type: 'success',
              onCancel: () => setModalProps(null)
            });

            setTimeout(async () => {
              const updatedList = await getAllSeriesWithDetails();
              setLocalSeriesList(
                updatedList.sort(
                  (a, b) =>
                    new Date(b.start_time).getTime() -
                    new Date(a.start_time).getTime()
                )
              );
              setModalProps(null);
              formData.current = {};
            }, 500);
          })
          .catch(() => {
            setModalProps({
              title: 'Error',
              message: 'Failed to update series. Please try again.',
              type: 'error',
              onCancel: () => setModalProps(null)
            });
          });
      },
      children: (
        <SeriesForm
          teamsList={teamsList}
          platforms={platforms}
          scheduleList={scheduleList}
          formData={formData}
          series={series}
        />
      )
    });
  };

  const handleDeleteSeries = (series: SeriesWithDetails) => {
    setModalProps({
      title: `Deleting Series`,
      message:
        'Are you sure you want to delete the following series? This action is irreversible.',
      type: 'warning',
      onCancel: () => setModalProps(null),
      onConfirm: async () => {
        await deleteSeries(series.id)
          .then(() => {
            setModalProps({
              title: 'Success',
              message: 'Series has been successfully deleted!',
              type: 'success',
              onCancel: () => setModalProps(null)
            });

            setTimeout(async () => {
              const updatedList = await getAllSeriesWithDetails();
              setLocalSeriesList(
                updatedList.sort(
                  (a, b) =>
                    new Date(b.start_time).getTime() -
                    new Date(a.start_time).getTime()
                )
              );
              setModalProps(null);
            }, 500);
          })
          .catch(() => {
            setModalProps({
              title: 'Error',
              message: 'Failed to delete series. Please try again.',
              type: 'error',
              onCancel: () => setModalProps(null)
            });
          });
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
      <aside className="flex place-items-center justify-end bg-neutral-900 p-4">
        {/* Insert & Delete Button */}
        <div className="flex space-x-4">
          <button
            className="flex place-items-center space-x-2 rounded-md border-2 border-green-700 bg-green-900 px-3 py-1 hover:border-green-600"
            onClick={handleInsertClick}
          >
            <span>
              <PlusIcon className="h-auto w-3 text-green-600" />
            </span>
            <span className="text-xs text-green-100">Insert</span>
          </button>
        </div>
        {/* End of Buttons */}

        <div className="flex w-fit flex-col"></div>
      </aside>
      {/* End of Controls */}

      {/* Content */}
      <div className="h-[80vh] w-full overflow-x-auto">
        {/* Series Cards */}
        <ul className="grid grid-cols-1 gap-8 p-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {paginatedSeries.map((series, index) => (
            <li
              className="flex flex-col rounded-md border-2 border-neutral-700 bg-neutral-900 shadow-lg"
              key={index}
            >
              {/* Header */}
              <header className="flex justify-between gap-4 px-4 py-2"></header>
              {/* End of Header */}
              {/* Body */}
              <div className="flex flex-col gap-4 p-4">
                <div className="grid grid-cols-5 place-items-center">
                  {/* Team A */}
                  <div
                    className={`col-span-2 flex place-items-center justify-center gap-4 ${series.team_a_status == 'Loss' ? 'opacity-40' : 'opacity-100'}`}
                  >
                    <figure className="flex flex-col place-items-center gap-2">
                      <Image
                        src={series.team_a?.logo_url!}
                        alt={`${series.team_a?.school_abbrev} Logo`}
                        width={40}
                        height={40}
                      />
                      <figcaption className="rounded bg-neutral-800 px-4 py-1 text-xs font-semibold text-neutral-300">
                        {series.team_a?.school_abbrev}
                      </figcaption>
                    </figure>
                    <span
                      className={`text-center font-bold ${series.team_a_status === 'Loss' ? 'text-red-600' : `${series.team_a_status === 'Win' ? 'text-green-600' : 'text-neutral-600'}`}`}
                    >
                      {series.team_a_score}
                    </span>
                  </div>
                  {/* End of Team A */}

                  {/* Middle */}
                  <div className="flex h-full flex-col place-items-center gap-3">
                    <p className="text-xs font-bold text-neutral-600">
                      {series?.series_type}
                    </p>
                    <span className="text-xs font-bold text-neutral-600">
                      vs
                    </span>
                  </div>
                  {/* End of Middle */}

                  {/* Team B */}
                  <div
                    className={`col-span-2 flex place-items-center justify-center gap-4 ${series.team_b_status === 'Loss' ? 'opacity-40' : 'opacity-100'}`}
                  >
                    <span
                      className={`text-center font-bold ${series.team_b_status === 'Loss' ? 'text-red-600' : `${series.team_b_status === 'Win' ? 'text-green-600' : 'text-neutral-600'}`}`}
                    >
                      {series.team_b_score}
                    </span>
                    <figure className="flex flex-col place-items-center gap-2">
                      <Image
                        src={series.team_b?.logo_url!}
                        alt={`${series.team_b?.school_abbrev} Logo`}
                        width={40}
                        height={40}
                      />
                      <figcaption className="rounded bg-neutral-800 px-4 py-1 text-xs font-semibold text-neutral-300">
                        {series.team_b?.school_abbrev}
                      </figcaption>
                    </figure>
                  </div>
                </div>
                {/* End of Team B */}

                {/* Date & Time */}
                <div className="flex justify-between">
                  <div className="flex flex-col gap-4">
                    <time className="flex gap-2 text-xs font-bold text-neutral-500">
                      <CalendarIcon className="h-auto w-4" />
                      {new Date(series.start_time).toLocaleDateString('en-CA', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric'
                      })}
                    </time>

                    <time className="flex gap-2 text-xs font-bold text-neutral-500">
                      <ClockIcon className="h-auto w-4" />
                      {new Date(series.start_time).toLocaleTimeString('en-CA', {
                        hour12: true,
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {' - '}
                      {new Date(series.end_time).toLocaleTimeString('en-CA', {
                        hour12: true,
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </time>
                  </div>
                  <div className="flex place-items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleUpdateClick(series)}
                    >
                      <PencilSquareIcon className="h-auto w-4 cursor-pointer text-neutral-400 hover:text-[var(--cel-blue)]" />
                    </button>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleDeleteSeries(series)}
                      >
                        <TrashIcon className="h-auto w-4 text-neutral-400 hover:text-[var(--cel-red)]" />
                      </button>
                    </div>
                  </div>
                </div>
                {/* End of Date & Time */}
              </div>
              {/* End of Body */}

              {/* Footer */}
              <footer className="flex justify-between border-t-2 border-neutral-600 bg-neutral-900 px-4 py-2">
                <span className="text-xs font-semibold text-neutral-500">
                  {series.league_schedule?.season_type}{' '}
                  {series.league_schedule?.season_number}
                  &nbsp; • &nbsp; {series.league_schedule?.league_stage}
                </span>
                <span className="flex gap-2 text-xs font-semibold text-neutral-500">
                  Week {series.week}
                  <Image
                    width={16}
                    height={16}
                    src={series.platform?.logo_url!}
                    alt={`${series.platform?.platform_abbrev} Logo`}
                  />
                </span>
              </footer>
              {/* End of Footer */}
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
