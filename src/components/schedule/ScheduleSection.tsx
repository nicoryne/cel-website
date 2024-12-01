'use client';

import React from 'react';
import SeriesContainer from '@/components/schedule/SeriesContainer';
import { SeriesWithDetails, GamePlatform } from '@/lib/types';
import Image from 'next/image';
import cel_logo from '@/../public/logos/cel.webp';
import { motion } from 'framer-motion';

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

type HomeSectionProps = {
  seriesList: SeriesWithDetails[];
  gamePlatformList: GamePlatform[];
};

export default function ScheduleSection({
  seriesList,
  gamePlatformList
}: HomeSectionProps) {
  const dateToday = new Date();

  const platformOptions = [
    { logo: cel_logo, abbrev: 'All Games' },
    ...gamePlatformList.map((platform) => ({
      logo: platform.logo_url,
      abbrev: platform.platform_abbrev
    }))
  ];

  const [filterState, setFilterState] = React.useState(platformOptions[0]);
  const [menuFilterState, toggleMenuFilter] = React.useState(false);
  const [currentDate, setCurrentDate] = React.useState(dateToday);

  const filteredSeries = React.useMemo(() => {
    return seriesList.filter((item) => {
      return filterState.abbrev === 'All Games'
        ? seriesList
        : item.platform?.platform_abbrev === filterState.abbrev;
    });
  }, [filterState, seriesList]);

  const activeSeries = React.useMemo(() => {
    const groupedSeries = groupSeriesByDate(filteredSeries);
    const todayDateStr = dateToday.toLocaleDateString('en-CA');

    if (!groupedSeries[todayDateStr]) {
      groupedSeries[todayDateStr] = [];
    }

    return groupedSeries;
  }, [filteredSeries, dateToday]);

  const sortedDates = Object.keys(activeSeries).sort((a, b) => {
    const dateA = new Date(a).getTime();
    const dateB = new Date(b).getTime();
    return dateB - dateA;
  });

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = sortedDates.map((date) => document.getElementById(date));
      const scrollY = window.scrollY + window.innerHeight / 4;

      const currentSection = sections.find((section) => {
        if (section) {
          const { top, bottom } = section.getBoundingClientRect();
          return top <= scrollY && bottom >= scrollY;
        }
        return false;
      });

      if (currentSection) {
        setCurrentDate(new Date(currentSection.id));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sortedDates]);

  return (
    <>
      {/* Control Panel */}
      <aside className="fixed left-0 right-0 top-20 z-40 mx-auto h-24 border-t-2 border-gray-800 bg-[var(--cel-navy)]">
        <div className="mx-auto rounded-b-md px-8 md:w-[800px] lg:w-[1100px]">
          <div className="flex place-items-center justify-between py-4">
            {/* Time Group */}
            <div className="flex flex-col uppercase text-white">
              {/* Month and Numeric Date */}
              <time className="text-3xl font-bold md:text-4xl">
                {currentDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </time>
              {/* 'Today' and Weekday Long */}
              <time className="text-sm md:text-base">
                {currentDate.toLocaleDateString('en-US', {
                  weekday: 'long'
                })}
              </time>
            </div>

            {/* Filter Game Button */}
            <div className="flex flex-col items-end space-y-12">
              <button
                className="flex h-10 w-40 items-center justify-center gap-2 rounded-md bg-[var(--cel-blue)] text-white"
                onClick={() => toggleMenuFilter(!menuFilterState)}
              >
                <Image
                  src={filterState.logo}
                  className="h-auto w-4"
                  width={128}
                  height={128}
                  alt={`${filterState.abbrev} Logo`}
                />
                {filterState.abbrev}
              </button>

              {menuFilterState && (
                <motion.div
                  className="absolute flex flex-wrap rounded-md bg-[var(--cel-navy)]"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 100, y: 0 }}
                >
                  {platformOptions.map((platform, index) => (
                    <button
                      className="flex h-24 w-24 flex-col items-center justify-center gap-2 text-xs text-neutral-400 hover:text-white"
                      key={index}
                      onClick={() => {
                        setFilterState(platform),
                          toggleMenuFilter(!menuFilterState);
                      }}
                    >
                      <Image
                        src={platform.logo}
                        className="h-auto w-4"
                        width={128}
                        height={128}
                        alt={`${platform.abbrev} Logo`}
                      />
                      {platform.abbrev}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Series Section */}
      <div className="mt-60 min-h-[90vh] space-y-16 overflow-y-auto">
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
              {activeSeries[date].length > 0 ? (
                activeSeries[date].map((series: SeriesWithDetails) => (
                  <SeriesContainer key={series.id} series={series} />
                ))
              ) : (
                <p className="text-center text-lg font-semibold text-neutral-600">
                  There's no games for today
                </p>
              )}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
