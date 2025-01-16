import { GamePlatform, LeagueSchedule, Series, SeriesWithDetails, Team } from '@/lib/types';
import { FilterState } from '@/components/schedule/types';
import { appendSeriesDetails } from '@/api/series';
import { sortByStartTime } from '@/components/admin/clients/series/utils';

const reduceSeriesByDate = (list: SeriesWithDetails[]) => {
  return list.reduce((acc: { [date: string]: SeriesWithDetails[] }, item: SeriesWithDetails) => {
    const date = new Date(item.start_time).toLocaleDateString('en-CA');

    if (!acc[date]) {
      acc[date] = [];
    }

    acc[date].push(item);
    acc[date].sort(sortByStartTime);

    return acc;
  }, {});
};

export const getActiveSeries = (series: SeriesWithDetails[], filterState: FilterState, dateToday: Date) => {
  const filteredSeries = series.filter((item) => {
    return filterState.abbrev === 'ALL' ? series : item.platform?.platform_abbrev === filterState.abbrev;
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

export const addSeriesToCache = (
  series: Series,
  setCachedSeries: React.Dispatch<React.SetStateAction<SeriesWithDetails[]>>,
  platformList: GamePlatform[],
  teamList: Team[],
  leagueScheduleList: LeagueSchedule[]
) => {
  setCachedSeries((prev) => {
    const exists = prev.some((cachedSeries) => cachedSeries.id === series.id);

    if (exists) return prev;

    const updated = [...prev, appendSeriesDetails(platformList, teamList, leagueScheduleList, series)];
    return updated.sort(sortByStartTime);
  });
};
