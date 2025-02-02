'use client';

import { SeriesWithDetails } from '@/lib/types';
import SeriesCard from '@/app/(admin)/dashboard/add-match/valorant/_components/choose-series/card';
import PaginationControls from '@/components/admin/pagination';
import React from 'react';

type ChooseSeriesProps = {
  seriesList: SeriesWithDetails[];
  setSeries: (id: string) => void;
};

export default function ChooseSeriesPanel({ seriesList, setSeries }: ChooseSeriesProps) {
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const totalItems = seriesList.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedSeries = React.useMemo(() => {
    const min = (currentPage - 1) * ITEMS_PER_PAGE;
    const max = min + ITEMS_PER_PAGE;

    return seriesList.slice(min, max);
  }, [seriesList, currentPage]);

  return (
    <div className="flex flex-col">
      {/* Content */}
      <div className="px-8">
        {/* Platform Cards */}
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {paginatedSeries.map((series, index) => (
            <li key={index}>
              <SeriesCard series={series} setSeries={setSeries} />
            </li>
          ))}
        </ul>
      </div>

      {/* End of Content */}
      <PaginationControls
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
