import { SeriesWithDetails } from '@/lib/types';
import { FilterState } from '@/components/schedule/types';

const reduceSeriesByDate = (list: SeriesWithDetails[]) => {
  return list.reduce(
    (acc: { [date: string]: SeriesWithDetails[] }, item: SeriesWithDetails) => {
      const date = item.start_time.toLocaleDateString('en-CA');

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(item);
      acc[date].sort((b, a) => a.start_time.getTime() - b.start_time.getTime());

      return acc;
    },
    {}
  );
};

export const getActiveSeries = (
  series: SeriesWithDetails[],
  filterState: FilterState,
  dateToday: Date
) => {
  const filteredSeries = series.filter((item) => {
    return filterState.abbrev === 'ALL'
      ? series
      : item.platform?.platform_abbrev === filterState.abbrev;
  });

  const groupedSeries = reduceSeriesByDate(filteredSeries);
  const todayDateStr = dateToday.toLocaleDateString('en-CA');

  if (!groupedSeries[todayDateStr]) {
    groupedSeries[todayDateStr] = [];
  }

  return groupedSeries;
};

export const scrollToDate = (date: Date) => {
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
