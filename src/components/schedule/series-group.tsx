'use client';

import React from 'react';
import { Series, SeriesWithDetails } from '@/lib/types';
import SeriesContainer from '@/components/schedule/series-container';

type SeriesGroupProps = {
  date: Date;
  seriesList: SeriesWithDetails[];
  sectionRef: React.LegacyRef<HTMLElement>;
};

export default function SeriesGroup({
  date,
  seriesList,
  sectionRef
}: SeriesGroupProps) {
  const dateLong = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const dateWeekday = date.toLocaleDateString('en-US', {
    weekday: 'long'
  });

  const isToday = date === new Date() ? 'true' : 'false';

  return (
    <section
      data-tag="date"
      data-scroll="target"
      data-today={isToday}
      data-date={dateLong}
      data-weekday={dateWeekday}
      ref={sectionRef}
      className="grid items-center rounded-lg bg-neutral-900 p-4"
    >
      <h4 className="col-span-1 text-lg font-bold uppercase md:col-span-2 md:text-2xl">
        {dateLong}
      </h4>
      <span className="col-span-1 text-end text-xs font-semibold uppercase text-neutral-400 md:col-span-2 md:text-start">
        {dateWeekday}
      </span>
      <div className="col-span-2 mt-4 grid gap-4">
        {seriesList.length > 0 ? (
          seriesList.map((series: SeriesWithDetails) => (
            <SeriesContainer key={series.id} series={series} />
          ))
        ) : (
          <p className="pb-8 pt-2 text-center text-lg font-semibold text-neutral-600">
            There's no games for today
          </p>
        )}
      </div>
    </section>
  );
}
