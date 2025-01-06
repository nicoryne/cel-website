'use client';

import React from 'react';

import { motion } from 'framer-motion';
import ControlPanel from '@/components/schedule/control-panel';
import SeriesGroup from '@/components/schedule/series-group';
import { GamePlatform, SeriesWithDetails } from '@/lib/types';
import { FilterState } from '@/components/schedule/types';
import { getActiveSeries, scrollToDate } from '@/components/schedule/util';
import cel_logo from '@/../public/logos/cel.webp';

type ScheduleBaseProps = {
  series: Promise<SeriesWithDetails[]>;
  gamePlatforms: Promise<GamePlatform[]>;
};

const fetchPlatformOptions = (platforms: Promise<GamePlatform[]>) => {
  const data = React.use(platforms);

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

export default function ScheduleBase({
  series,
  gamePlatforms
}: ScheduleBaseProps) {
  const dateToday = new Date();
  const platformOptions = fetchPlatformOptions(gamePlatforms);
  const seriesList: SeriesWithDetails[] = React.use(series);

  const [menuFilterState, toggleMenuFilter] = React.useState(false);
  const [filterState, setFilterState] = React.useState(platformOptions[0]);

  const activeSeries = React.useMemo(
    () => getActiveSeries(seriesList, filterState, dateToday),
    [filterState, seriesList, dateToday]
  );

  const sortedDates = Object.keys(activeSeries).sort((a, b) => {
    const dateA = new Date(a).getTime();
    const dateB = new Date(b).getTime();
    return dateB - dateA;
  });

  const [currentDate, setCurrentDate] = React.useState(dateToday);

  const handleDateButtonPress = (type: 'prev' | 'today' | 'next') => {
    const currentIndex = sortedDates.indexOf(
      currentDate.toLocaleDateString('en-CA')
    );

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

  const sectionRefs = React.useRef<(HTMLElement | null)[]>([]);

  // Scrolling Effect
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

  return (
    <>
      <ControlPanel
        currentDate={currentDate}
        handleDateButtonPress={handleDateButtonPress}
        platformOptions={platformOptions}
        filterState={filterState}
        setFilterState={setFilterState}
        menuFilterState={menuFilterState}
        toggleMenuFilter={toggleMenuFilter}
      />

      <motion.div
        className="min-h-[90vh] space-y-16 overflow-y-auto pt-64"
        initial={{ opacity: 0.1 }}
        animate={{ opacity: 1 }}
      >
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
      </motion.div>
    </>
  );
}
