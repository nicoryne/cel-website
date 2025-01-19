'use client';

import { SeriesWithDetails, ValorantMatch } from '@/lib/types';
import SeriesCard from './series-card';
import PaginationControls from '@/components/admin/pagination';
import React from 'react';

type ChooseSeriesProps = {
  seriesList: SeriesWithDetails[];
  setSeries: (id: string) => void;
};

export default function ChooseSeries({ seriesList, setSeries }: ChooseSeriesProps) {
  const ITEMS_PER_PAGE = 6;
  const [totalItems, setTotalItems] = React.useState<number>(seriesList.length);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedSeries = React.useMemo(() => {
    const min = (currentPage - 1) * ITEMS_PER_PAGE;
    const max = min + ITEMS_PER_PAGE;

    return seriesList.slice(min, max);
  }, [seriesList, currentPage]);

  return (
    <div className="flex flex-col gap-16">
      {/* Content */}
      <div className="h-fit w-full px-8">
        <div className="relative overflow-x-auto border-2 border-neutral-800 sm:rounded-lg">
          {/* Platform Cards */}
          <ul className="grid grid-cols-1 gap-8 p-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {paginatedSeries.map((series, index) => (
              <li key={index}>
                <SeriesCard series={series} setSeries={setSeries} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* End of Content */}
      <PaginationControls currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
    </div>
  );
}
