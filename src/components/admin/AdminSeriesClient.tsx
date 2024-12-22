'use client';

import {
  GamePlatform,
  LeagueSchedule,
  Series,
  SeriesWithDetails,
  Team
} from '@/lib/types';
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/20/solid';
import React from 'react';
import Modal, { ModalProps } from '@/components/Modal';
import InsertSeriesModal from '@/components/modals/InsertSeriesModal';
import {
  createSeries,
  deleteSeries,
  getAllSeries,
  getAllSeriesWithDetails,
  updateSeries
} from '@/api';

const tableHeaders = [
  '#',
  'Start Time',
  'Platform',
  'Team A',
  'Team A Score',
  'Team B',
  'Team B Score',
  'Week',
  'Status',
  ''
];

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
  const [localSeriesList, setLocalSeriesList] = React.useState<
    SeriesWithDetails[]
  >(
    seriesList.sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    )
  );

  // Format Date
  const formatDate = (date: Date) =>
    new Date(date).toLocaleString('en-CA', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  // Row Handler
  const [isARowChecked, setIsARowChecked] = React.useState(false);
  const [checkedRows, setCheckedRows] = React.useState<boolean[]>(
    new Array(seriesList.length).fill(false)
  );

  React.useEffect(() => {
    setCheckedRows(new Array(seriesList.length).fill(false));
  }, [seriesList.length]);

  React.useEffect(() => {
    setIsARowChecked(checkedRows.some(Boolean));
  }, [checkedRows]);

  const handleRowCheckboxChange = (index: number) => {
    setCheckedRows((prev) => {
      const newCheckedRows = [...prev];
      newCheckedRows[index] = !newCheckedRows[index];
      return newCheckedRows;
    });
  };

  const handleRowCheckboxCheckAll = () => {
    const allChecked = checkedRows.every((checked) => checked);
    setCheckedRows(new Array(seriesList.length).fill(!allChecked));
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
                    new Date(a.start_time).getTime() -
                    new Date(b.start_time).getTime()
                )
              );
              setModalProps(null);
              formData.current = {};
            }, 2000);
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
        <InsertSeriesModal
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
                    new Date(a.start_time).getTime() -
                    new Date(b.start_time).getTime()
                )
              );
              setModalProps(null);
              formData.current = {};
            }, 2000);
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
        <InsertSeriesModal
          teamsList={teamsList}
          platforms={platforms}
          scheduleList={scheduleList}
          formData={formData}
          series={series}
        />
      )
    });
  };

  const handleDeleteSeries = () => {
    const toDeleteRows = checkedRows
      .map((isChecked, index) => (isChecked ? index : -1))
      .filter((index) => index !== -1);

    setModalProps({
      title: `Deleting Series`,
      message:
        'Are you sure you want to delete the following series? This action is irreversible.',
      type: 'warning',
      onCancel: () => setModalProps(null),
      onConfirm: async () => {
        try {
          const successfullyDeletedIndices: number[] = [];

          for (const rowIndex of toDeleteRows) {
            const deleted = await deleteSeries(localSeriesList[rowIndex].id);
            if (deleted) {
              successfullyDeletedIndices.push(rowIndex);
            }
          }

          setLocalSeriesList((prev) =>
            prev
              .filter((_, index) => !successfullyDeletedIndices.includes(index))
              .sort(
                (a, b) =>
                  new Date(a.start_time).getTime() -
                  new Date(b.start_time).getTime()
              )
          );

          setCheckedRows((prev) =>
            prev.filter(
              (_, index) => !successfullyDeletedIndices.includes(index)
            )
          );

          setModalProps({
            title: 'Success',
            message: `${successfullyDeletedIndices.length} series have been successfully deleted!`,
            type: 'success',
            onCancel: () => setModalProps(null)
          });

          setTimeout(() => {
            setModalProps(null);
          }, 2000);
        } catch {
          setModalProps({
            title: 'Error',
            message: 'Failed to delete series. Please try again.',
            type: 'error',
            onCancel: () => setModalProps(null)
          });
        }
      }
    });
  };

  return (
    <>
      {/* Insert Series Modal */}
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
      {/* Series Table */}
      <div className="flex space-x-4 bg-neutral-900 p-2">
        {!isARowChecked && (
          <button
            className="flex place-items-center space-x-2 rounded-md border-2 border-green-700 bg-green-900 px-3 py-1 hover:border-green-600"
            onClick={handleInsertClick}
          >
            <span>
              <PlusIcon className="h-auto w-3 text-green-600" />
            </span>
            <span className="text-xs text-green-100">Insert</span>
          </button>
        )}
        {isARowChecked && (
          <button
            onClick={() =>
              setCheckedRows(new Array(seriesList.length).fill(false))
            }
            className="flex place-items-center space-x-2 rounded-md border-2 border-neutral-700 bg-neutral-900 px-3 py-1 hover:border-neutral-600"
          >
            <span>
              <XMarkIcon className="h-auto w-3 text-neutral-200" />
            </span>
          </button>
        )}
        {isARowChecked && (
          <button
            onClick={handleDeleteSeries}
            className="flex place-items-center space-x-2 rounded-md border-2 border-red-700 bg-red-900 px-3 py-1 hover:border-red-600"
          >
            <span>
              <TrashIcon className="h-auto w-3 text-red-200" />
            </span>
            <span className="text-xs text-red-100">Delete</span>
          </button>
        )}
      </div>
      <div className="w-full overflow-x-auto border-2 border-neutral-800 shadow-md">
        <table className="w-full text-sm text-neutral-500">
          <thead className="text-md text-nowrap bg-neutral-800 text-center text-neutral-300">
            <tr>
              <th className="px-2">
                <input
                  type="checkbox"
                  checked={checkedRows.every(Boolean)}
                  onChange={handleRowCheckboxCheckAll}
                  className="rounded bg-neutral-800 text-[var(--accent-primary)] outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                />
              </th>
              {tableHeaders.map((header, index) => (
                <th scope="col" key={index} className="px-4 py-2 font-normal">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {localSeriesList.map((series, index) => (
              <tr
                key={index}
                className="border-b border-transparent text-center text-xs hover:text-neutral-300 [&:not(:last-child)]:border-neutral-700"
              >
                <td>
                  <input
                    type="checkbox"
                    checked={checkedRows[index]}
                    onChange={() => handleRowCheckboxChange(index)}
                    className="rounded bg-neutral-800 text-[var(--accent-primary)] outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                  />
                </td>
                <td className="py-2">{index + 1}</td>
                <td>{formatDate(series.start_time)}</td>
                <td>{series.platform?.platform_abbrev || 'N/A'}</td>
                <td>{series.team_a?.school_abbrev || 'N/A'}</td>
                <td>{series.team_a_score}</td>
                <td>{series.team_b?.school_abbrev || 'N/A'}</td>
                <td>{series.team_b_score}</td>
                <td>{series.week}</td>
                <td>{series.status}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleUpdateClick(series)}
                  >
                    <PencilSquareIcon className="h-auto w-4 cursor-pointer hover:text-[var(--cel-blue)]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
