'use client';

import React from 'react';
import SeriesContainer from '@/components/schedule/SeriesContainer';
import { SeriesWithDetails, GamePlatform } from '@/lib/types';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/16/solid';
import Image from 'next/image';
import cel_logo from '@/../public/logos/cel.webp';
import { motion } from 'framer-motion';

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
    { logo: cel_logo, abbrev: 'ALL', title: 'All Games' },
    ...gamePlatformList.map((platform) => ({
      logo: platform.logo_url,
      abbrev: platform.platform_abbrev,
      title: platform.platform_title
    }))
  ];

  const groupSeriesByDate = (list: SeriesWithDetails[]) => {
    return list.reduce(
      (
        acc: { [date: string]: SeriesWithDetails[] },
        item: SeriesWithDetails
      ) => {
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

  const [filterState, setFilterState] = React.useState(platformOptions[0]);
  const [menuFilterState, toggleMenuFilter] = React.useState(false);

  const filteredSeries = React.useMemo(() => {
    return seriesList.filter((item) => {
      return filterState.abbrev === 'ALL'
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

  // Scrolling Effect
  const [currentDate, setCurrentDate] = React.useState(dateToday);

  const sectionRefs = React.useRef<(HTMLElement | null)[]>([]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targetElement = entry.target as HTMLElement;
            const dateStr = targetElement.dataset.date;
            if (dateStr) {
              setCurrentDate(new Date(dateStr));
            }
          }
        });
      },
      {
        threshold: 0.8,
        rootMargin: '0px 0px -30% 0px'
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToDate = (date: Date) => {
    const dateStr = date.toLocaleDateString('en-CA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const currentSection = document.querySelector(`[data-date="${dateStr}"]`);

    if (currentSection) {
      currentSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handlePreviousDate = () => {
    const currentIndex = sortedDates.indexOf(
      currentDate.toLocaleDateString('en-CA')
    );

    if (currentIndex > 0) {
      const previousDateStr = sortedDates[currentIndex - 1];
      const previousDate = new Date(previousDateStr);
      setCurrentDate(previousDate);
      scrollToDate(previousDate);
    }
  };

  const handleNextDate = () => {
    const currentIndex = sortedDates.indexOf(
      currentDate.toLocaleDateString('en-CA')
    );

    if (currentIndex < sortedDates.length - 1) {
      const nextDateStr = sortedDates[currentIndex + 1];
      const nextDate = new Date(nextDateStr);
      setCurrentDate(nextDate);
      scrollToDate(nextDate);
    }
  };

  const setDateToCurrentDate = () => {
    if (dateToday !== currentDate) {
      setCurrentDate(dateToday);
      scrollToDate(dateToday);
    }
  };

  return (
    <>
      {/* Control Panel */}
      <aside className="fixed left-0 right-0 top-20 z-40 mx-auto h-24 border-t-2 border-neutral-800">
        {/* Container */}
        <div className="mx-auto rounded-b-md bg-[#121212] px-8 md:w-[800px] lg:w-[1100px]">
          {/* Wrapper */}
          <div className="flex flex-col gap-4 py-4">
            <div className="flex place-items-center justify-between">
              {/* Time Group */}
              <div className="flex flex-col uppercase">
                {/* Month and Numeric Date */}
                <span className="text-xl font-bold md:text-4xl">
                  {currentDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                {/* 'Today' and Weekday Long */}
                <span className="text-sm md:text-base">
                  {currentDate.toLocaleDateString('en-US', {
                    weekday: 'long'
                  })}
                </span>
              </div>
              {/* End of Time Group */}

              {/* Date Picker Buttons */}
              <div className="flex place-items-center justify-center">
                {/* Previous Date */}
                <button
                  type="button"
                  className="bg-neutral-800 p-2 transition-colors duration-150 ease-linear hover:bg-neutral-900"
                  onClick={handlePreviousDate}
                >
                  <ArrowLeftIcon className="h-auto w-6 text-white" />
                </button>

                {/* Today */}
                <button
                  type="button"
                  className="bg-neutral-800 px-4 py-2 transition-colors duration-150 ease-linear hover:bg-neutral-900"
                  onClick={setDateToCurrentDate}
                >
                  <span className="text-xs font-semibold uppercase md:text-base">
                    Today
                  </span>
                </button>

                {/* Next Date */}
                <button
                  type="button"
                  className="bg-neutral-800 p-2 transition-colors duration-150 ease-linear hover:bg-neutral-900"
                  onClick={handleNextDate}
                >
                  <ArrowRightIcon className="h-auto w-6 text-white" />
                </button>
              </div>
              {/* End of Date Picker Buttons */}
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              {/* Filter Game Button */}
              <div>
                <span className="text-xs text-neutral-500">Filter Game</span>
                <div className="flex flex-col space-y-12">
                  <button
                    className="flex h-10 w-24 items-center justify-center gap-2 bg-neutral-800 text-xs text-white transition-colors duration-150 ease-linear hover:bg-neutral-700"
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
                      className="absolute flex flex-col flex-wrap rounded-md shadow-lg"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 100, y: 0 }}
                    >
                      {platformOptions.map((platform, index) => (
                        <button
                          className={`flex h-16 w-36 items-center justify-center gap-2 text-neutral-300 hover:text-white ${platform.abbrev === filterState.abbrev ? 'bg-neutral-800' : 'bg-[var(--background)]'}`}
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
                          <p className="w-24 break-words text-xs">
                            {platform.title}
                          </p>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
              {/* End of Filter Game Button */}

              {/* Date Button */}
              <div></div>
            </div>
          </div>
          {/* End of Wrapper */}
        </div>
        {/* End of Container */}
      </aside>

      {/* Series Section Container */}
      <motion.div
        className="min-h-[90vh] space-y-16 overflow-y-auto pt-64"
        initial={{ opacity: 0.1 }}
        animate={{ opacity: 1 }}
      >
        {sortedDates.map((date, index) => (
          <section
            data-tag="date"
            data-scroll="target"
            data-today={
              date === new Date().toLocaleDateString('en-CA') ? 'true' : 'false'
            }
            key={date}
            data-date={new Date(date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
            data-weekday={new Date(date).toLocaleDateString('en-US', {
              weekday: 'long'
            })}
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
            className="grid items-center rounded-lg bg-neutral-900 p-4"
          >
            <h4 className="col-span-1 text-lg font-bold uppercase md:col-span-2 md:text-2xl">
              {new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </h4>
            <span className="col-span-1 text-end text-xs font-semibold uppercase text-neutral-400 md:col-span-2 md:text-start">
              {new Date(date).toLocaleDateString('en-US', {
                weekday: 'long'
              })}
            </span>
            <div className="col-span-2 mt-4 grid gap-4">
              {activeSeries[date].length > 0 ? (
                activeSeries[date].map((series: SeriesWithDetails) => (
                  <SeriesContainer key={series.id} series={series} />
                ))
              ) : (
                <p className="pb-8 pt-2 text-center text-lg font-semibold text-neutral-600">
                  There's no games for today
                </p>
              )}
            </div>
          </section>
        ))}
      </motion.div>
    </>
  );
}
