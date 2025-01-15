import { createClient } from '@/lib/supabase/client';
import { Series, SeriesWithDetails } from '@/lib/types';
import { getTeamById } from '@/api/team';
import { getLeagueScheduleById } from '@/api/league-schedule';
import { getGamePlatformById } from '@/api/game-platform';
import { handleError } from '@/api/utils/errorHandler';

//====================
// Series API
//====================

//========
// CREATE
//========

export const createSeries = async (series: {}): Promise<{} | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('series').insert([series]);

  if (error) {
    handleError(error, 'creating series');
    return null; // Return null if there is an error
  }

  return data;
};

//========
// READ
//========

export const getAllSeries = async (): Promise<Series[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('series').select('*').order('start_time', { ascending: false });

  if (error) {
    handleError(error, 'fetching all series');
    return [];
  }

  return data || [];
};

export const getSeriesById = async (id: string): Promise<Series | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('series').select('*').eq('id', id).single();

  if (error) {
    handleError(error, `fetching Series by ID: ${id}`);
    return null;
  }

  return data;
};

export const getAllSeriesWithDetails = async (): Promise<SeriesWithDetails[]> => {
  const seriesList = await getAllSeries();
  const seriesListWithDetails: SeriesWithDetails[] = [];

  await Promise.all(
    seriesList.map(async (series) => {
      const teamA = await getTeamById(series.team_a_id);
      const teamB = await getTeamById(series.team_b_id);
      const leagueSchedule = await getLeagueScheduleById(series.league_schedule_id);
      const gamePlatform = await getGamePlatformById(series.platform_id);

      seriesListWithDetails.push({
        ...series,
        league_schedule: leagueSchedule,
        team_a: teamA || null,
        team_b: teamB || null,
        platform: gamePlatform || null
      });
    })
  );

  return seriesListWithDetails;
};

//========
// UPDATE
//========

export const updateSeries = async (id: string, updates: Partial<Series>): Promise<Series | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('series').update(updates).eq('id', id).single();

  if (error) {
    handleError(error, `updating series by ID: ${id}`);
    return null;
  }

  return data;
};

//========
// DELETE
//========

export const deleteSeries = async (id: string): Promise<boolean> => {
  const supabase = createClient();
  const { error } = await supabase.from('series').delete().eq('id', id);

  if (error) {
    handleError(error, `deleting series by ID: ${id}`);
    return false;
  }

  return true;
};
