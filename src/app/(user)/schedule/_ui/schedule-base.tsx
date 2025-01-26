'use client';

import { useEffect, useState, useMemo, useRef, use } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import SeriesGroup from '@/app/(user)/schedule/_ui/series-group';
import { GamePlatform, LeagueSchedule, Series, SeriesWithDetails, Team } from '@/lib/types';
import { FilterState } from '@/app/(user)/schedule/_ui/types';
import { addSeriesToCache, getActiveSeries, scrollToDate } from '@/app/(user)/schedule/_ui/util';
import cel_logo from '@/../public/logos/cel.webp';
import DropdownItem from '@/components/ui/dropdown-item';
import Dropdown from '@/components/ui/dropdown';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/16/solid';

interface ScheduleBaseProps {
  series: Promise<Series[]>;
  teamList: Promise<Team[]>;
  platformList: Promise<GamePlatform[]>;
  leagueScheduleList: Promise<LeagueSchedule[]>;
}

const fetchPlatformOptions = (platforms: Promise<GamePlatform[]>) => {
  const data = use(platforms);

  const platformOptions: FilterState[] = [
    {
      logo: cel_logo,
      abbrev: 'ALL',
      title: 'All Games'
    },
    ...data.map((platform) => ({
      logo: platform.logo_url,
      abbrev: platform.platform_abbrev,
      title: platform.platform_title
    }))
  ];

  return platformOptions;
};

export default function ScheduleBase({ series, teamList, platformList, leagueScheduleList }: ScheduleBaseProps) {
  const dateToday = new Date();
  const processedTeamList = use(teamList);
  const processedPlatformList = use(platformList);
  const processedLeagueScheduleList = use(leagueScheduleList);
  const platformOptions = fetchPlatformOptions(platformList);
  const seriesList: Series[] = use(series);

  const [seriesCache, setSeriesCache] = useState<SeriesWithDetails[]>([]);
  const [filterState, setFilterState] = useState(platformOptions[0]);

  useEffect(() => {
    seriesList.forEach((series) => {
      addSeriesToCache(series, setSeriesCache, processedPlatformList, processedTeamList, processedLeagueScheduleList);
    });
  }, [seriesList]);
  const activeSeries = useMemo(
    () => getActiveSeries(seriesCache, filterState, dateToday),
    [filterState, seriesCache, dateToday]
  );

  const sortedDates = Object.keys(activeSeries).sort((a, b) => {
    const dateA = new Date(a).getTime();
    const dateB = new Date(b).getTime();
    return dateB - dateA;
  });

  const [currentDate, setCurrentDate] = useState(dateToday);

  const handleDateButtonPress = (type: 'prev' | 'today' | 'next') => {
    const currentIndex = sortedDates.indexOf(currentDate.toLocaleDateString('en-CA'));

    const setDateAndScroll = (date: Date) => {
      setCurrentDate(date);
      scrollToDate(date);
    };

    switch (type) {
      case 'next':
        if (currentIndex < sortedDates.length - 1) {
          const nextDateStr = sortedDates[currentIndex + 1];
          const nextDate = new Date(nextDateStr);
          setDateAndScroll(nextDate);
        }

        break;
      case 'prev':
        if (currentIndex > 0) {
          const prevDateStr = sortedDates[currentIndex - 1];
          const prevDate = new Date(prevDateStr);
          setDateAndScroll(prevDate);
        }

        break;
      case 'today':
        if (dateToday !== currentDate) {
          setDateAndScroll(dateToday);
        }

        break;
    }
  };

  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targetElement = entry.target as HTMLElement;
            const dateStr = targetElement.dataset.date;
            console.log(entry);
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

  return (
    <>
      <aside className="fixed left-0 right-0 top-20 z-40 mx-auto h-24 border-t-2 border-neutral-800">
        <div className="mx-auto rounded-b-md bg-background px-8 md:w-[800px] lg:w-[1100px]">
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

              {/* Date Selector Buttons */}
              <div className="flex place-items-center justify-center shadow-sm">
                {/* Previous Date */}
                <button
                  type="button"
                  className="p-2 transition-colors duration-150 ease-linear hover:bg-neutral-200 hover:dark:bg-neutral-900"
                  onClick={() => handleDateButtonPress('prev')}
                >
                  <ArrowLeftIcon className="h-auto w-6" />
                </button>

                {/* Today */}
                <button
                  type="button"
                  className="px-4 py-2 transition-colors duration-150 ease-linear hover:bg-neutral-200 hover:dark:bg-neutral-900"
                  onClick={() => handleDateButtonPress('today')}
                >
                  <span className="text-xs font-semibold uppercase md:text-base">Today</span>
                </button>

                {/* Next Date */}
                <button
                  type="button"
                  className="p-2 transition-colors duration-150 ease-linear hover:bg-neutral-200 hover:dark:bg-neutral-900"
                  onClick={() => handleDateButtonPress('next')}
                >
                  <ArrowRightIcon className="h-auto w-6" />
                </button>
              </div>
            </div>

            <Dropdown value={filterState.abbrev} image={filterState.logo}>
              {platformOptions.map((platform, index) => (
                <DropdownItem
                  key={index}
                  onClick={() => {
                    setFilterState(platform);
                  }}
                  selected={platform.abbrev === filterState.abbrev}
                >
                  <div className="flex items-center justify-between gap-12">
                    <p className="break-words text-xs">{platform.title}</p>
                    <Image
                      src={platform.logo}
                      className="h-auto w-4"
                      width={128}
                      height={128}
                      alt={`${platform.abbrev} Logo`}
                    />
                  </div>
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
        </div>
      </aside>

      <main className="min-h-[90vh] space-y-16 overflow-y-auto pt-64">
        {sortedDates.map((date, index) => (
          <SeriesGroup
            date={new Date(date)}
            key={index}
            seriesList={activeSeries[date]}
            sectionRef={(el) => {
              sectionRefs.current[index] = el;
            }}
          />
        ))}
      </main>
    </>
  );
}
