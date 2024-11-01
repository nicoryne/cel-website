'use client';
import React from 'react';
import SwitchGroup from './SwitchGroup';
import mlbb_logo from '@/../public/logos/mlbb.webp';
import valorant_logo from '@/../public/logos/valorant.webp';
import SeriesContainer from './SeriesContainer';
import { SeriesWithDetails, GamePlatform } from '@/lib/types';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';

const groupSeriesByDate = (list: SeriesWithDetails[]) => {
  return list.reduce(
    (acc: { [date: string]: SeriesWithDetails[] }, item: SeriesWithDetails) => {
      const date = new Date(item.start_time).toLocaleDateString('en-CA');

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(item);
      acc[date].sort(
        (b, a) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );
      return acc;
    },
    {}
  );
};

export default function HomeSection({
  seriesList,
  gamePlatformList
}: {
  seriesList: SeriesWithDetails[];
  gamePlatformList: GamePlatform[];
}) {
  const [filterState, setFilterState] = React.useState('All Games');
  const [menuFilterState, toggleMenuFilter] = React.useState(false);
  const dateToday = new Date();

  const filteredSeries = React.useMemo(() => {
    return seriesList.filter((item) => {
      return filterState === 'All Games'
        ? seriesList
        : item.platform.platform_abbrev === filterState;
    });
  }, [filterState, seriesList]);

  const activeSeries = React.useMemo(
    () => groupSeriesByDate(filteredSeries),
    [filteredSeries]
  );

  const sortedDates = Object.keys(activeSeries).sort((a, b) => {
    const dateA = new Date(a).getTime();
    const dateB = new Date(b).getTime();
    return dateB - dateA;
  });

  const platformOptions = [
    'All Games',
    ...gamePlatformList.map((platform) => platform.platform_abbrev)
  ];

  return (
    <>
      {/* Control Panel */}
      <aside className="flex place-items-center justify-between">
        {/* Time Group */}
        <div className="flex flex-col uppercase">
          {/* Month and Numeric Date */}
          <time className="text-3xl font-bold md:text-4xl">
            {dateToday.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </time>
          {/* 'Today' and Weekday Long */}
          <time className="text-sm md:text-base">
            Today&nbsp; | &nbsp;
            {dateToday.toLocaleDateString('en-US', {
              weekday: 'long'
            })}
          </time>
        </div>

        {/* Filter Game Button */}
        <div className="flex flex-col place-items-center space-y-12">
          <button
            className="flex h-10 w-40 items-center justify-center gap-2 rounded-lg border-2 border-neutral-800 hover:bg-neutral-800"
            onClick={() => toggleMenuFilter(!menuFilterState)}
          >
            {filterState}
            <ChevronDownIcon className="h-4 w-4" />
          </button>

          {menuFilterState && (
            <div className="absolute flex flex-col text-center">
              {platformOptions.map((abbrev) => (
                <button
                  className="flex h-10 w-40 items-center justify-center gap-2 border-b-2 border-neutral-800 bg-neutral-900 p-4 hover:bg-neutral-800"
                  key={abbrev}
                  onClick={() => {
                    setFilterState(abbrev), toggleMenuFilter(!menuFilterState);
                  }}
                >
                  {abbrev}
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Series Section */}
      <div className="mt-12 space-y-16">
        {sortedDates.map((date) => (
          <section id={date} key={date} className="grid items-center">
            <h1 className="col-span-1 text-2xl font-bold uppercase md:col-span-2">
              {new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </h1>
            <time className="col-span-1 text-end text-xs font-semibold uppercase text-neutral-400 md:col-span-2 md:text-start">
              {new Date(date).toLocaleDateString('en-US', {
                weekday: 'long'
              })}
            </time>
            <div className="col-span-2 mt-4 grid gap-4">
              {activeSeries[date].map((series: SeriesWithDetails) => (
                <SeriesContainer key={series.id} series={series} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
