'use server';
import { createClient } from '@/lib/supabase/client';
import { Series, SeriesWithDetails } from '@/lib/types';
import { getTeamById } from './fetch-team';
import { getLeagueScheduleById } from './fetch-league-schedule';
import { getGamePlatformById } from './fetch-platform';

export const getAllSeries = async (): Promise<Series[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('series').select('*');

  if (error) {
    console.error('🔴 Error fetching series:', error.message);
    return [];
  }

  return data || [];
};

export const getSeriesById = async (id: string): Promise<Series> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('series')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('🔴 Error fetching series by ID:', error.message);
  }

  return data;
};

export const getAllSeriesWithDetails = async (): Promise<
  SeriesWithDetails[]
> => {
  const seriesList = await getAllSeries();
  const seriesListWithDetails: SeriesWithDetails[] = [];

  await Promise.all(
    seriesList.map(async (series) => {
      const teamA = await getTeamById(series.team_a_id);
      const teamB = await getTeamById(series.team_b_id);
      const leagueSchedule = await getLeagueScheduleById(
        series.league_schedule_id
      );
      const gamePlatform = await getGamePlatformById(series.platform_id);

      seriesListWithDetails.push({
        ...series,
        league_schedule: leagueSchedule || null,
        team_a: teamA || null,
        team_b: teamB || null,
        platform: gamePlatform || null
      });
    })
  );

  return seriesListWithDetails;
};
