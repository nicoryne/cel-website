'use client';

import { SeriesWithDetails } from '@/lib/types';
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/20/solid';
import React from 'react';

const tableHeaders = [
  '#',
  'Start Time',
  'Platform',
  'Team A',
  'Team A Score',
  'Team B',
  'Team B Score',
  'Week',
  'Is Live',
  ''
];

type AdminSeriesClientProps = {
  seriesList: SeriesWithDetails[];
};

export default function AdminSeriesClient({
  seriesList
}: AdminSeriesClientProps) {
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

  const formatDate = (date: Date) =>
    new Date(date).toLocaleString('en-CA', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

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

  return (
    <>
      {/* Series Table */}
      <div className="flex space-x-4 bg-neutral-900 p-2">
        {!isARowChecked && (
          <button className="flex place-items-center space-x-2 rounded-md border-2 border-green-700 bg-green-900 px-3 py-1 hover:border-green-600">
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
          <button className="flex place-items-center space-x-2 rounded-md border-2 border-red-700 bg-red-900 px-3 py-1 hover:border-red-600">
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
            {seriesList.map((series, index) => (
              <tr
                key={series.id}
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
                <td>{series.is_live ? '🟢' : '🔴'}</td>
                <td>
                  <PencilSquareIcon className="h-auto w-4 cursor-pointer hover:text-[var(--accent-secondary)]" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
