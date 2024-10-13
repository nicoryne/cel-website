'use client';

import React from 'react';
import Image from 'next/image';
import mlbb_logo from '@/../public/logos/mlbb.webp';
import valorant_logo from '@/../public/logos/valorant.webp';
import SeriesContainer from './series-container';
import { Switch } from '@headlessui/react';
import { SeriesWithDetails } from '@/lib/types';

const groupByDate = (list: SeriesWithDetails[]) => {
  return list.reduce((acc: any, item: any) => {
    const date = item.series_date;

    if (!acc[date]) {
      acc[date] = [];
    }

    acc[date].push(item);
    return acc;
  }, {});
};

export default function StartPage({
  seriesList
}: {
  seriesList: SeriesWithDetails[];
}) {
  const [MLBBEnabled, setMLBBEnabled] = React.useState(true);
  const [VALOEnabled, setVALOEnabled] = React.useState(true);
  const today = new Date();

  const [renderSeries, setRenderSeries] = React.useState(
    groupByDate(seriesList)
  );

  React.useEffect(() => {
    if (MLBBEnabled && !VALOEnabled) {
      setRenderSeries(
        groupByDate(
          seriesList.filter((item) => item.platform.platform_abbrev === 'MLBB')
        )
      );
    } else if (!MLBBEnabled && VALOEnabled) {
      setRenderSeries(
        groupByDate(
          seriesList.filter((item) => item.platform.platform_abbrev === 'VALO')
        )
      );
    } else {
      setRenderSeries(groupByDate(seriesList));
    }
  }, [MLBBEnabled, VALOEnabled]);

  const sortedDates = Object.keys(renderSeries).sort((a, b) => {
    const dateA = new Date(a).getTime();
    const dateB = new Date(b).getTime();
    return dateB - dateA;
  });

  return (
    <main className="flex min-w-full flex-col items-center justify-center">
      <div className="flex w-full items-center justify-between md:w-[70%] lg:w-[90%] xl:w-[50%]">
        {/* Control Panel */}
        <div className="flex w-full justify-between space-x-12 rounded-md p-8">
          {/* Date Now */}
          <div className="flex flex-col">
            <strong className="text-4xl">
              {today
                .toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })
                .toUpperCase()}
            </strong>
            <span>
              TODAY | &nbsp;
              {today
                .toLocaleDateString('en-US', {
                  weekday: 'long'
                })
                .toUpperCase()}
            </span>
          </div>

          {/* Platform Switches */}
          <div className="flex">
            {/* MLBB Switch */}
            <div className="mx-4 flex items-center">
              <Image className="mr-2 h-8 w-8" src={mlbb_logo} alt="MLBB Logo" />
              <Switch
                checked={MLBBEnabled}
                onChange={setMLBBEnabled}
                className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-[var(--accent-secondary)]"
              >
                <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
              </Switch>
            </div>

            <div className="mx-4 flex items-center">
              <Image
                className="mr-2 h-8 w-8"
                src={valorant_logo}
                alt="VALORANT Logo"
              />
              <Switch
                checked={VALOEnabled}
                onChange={setVALOEnabled}
                className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-[var(--accent-primary)]"
              >
                <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
              </Switch>
            </div>
          </div>
        </div>
      </div>
      {/* Match Schedules */}
      <div className="flex h-full w-full flex-col md:w-[70%] lg:w-[90%] xl:w-[50%]">
        <div className="h-[calc(100vh-80px)] flex-grow overflow-y-auto">
          {sortedDates.map((date) => (
            <div key={date} className="flex flex-col p-8">
              <div className="mb-4 flex flex-col">
                <span className="ml-2 text-xs text-neutral-400">
                  {new Date(date)
                    .toLocaleDateString('en-US', {
                      weekday: 'long'
                    })
                    .toUpperCase()}
                </span>
                <strong className="text-2xl">
                  {new Date(date)
                    .toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric'
                    })
                    .toUpperCase()}
                </strong>
              </div>
              <div className="space-y-4">
                {renderSeries[date].map((series: SeriesWithDetails) => (
                  <SeriesContainer key={series.id} series={series} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
