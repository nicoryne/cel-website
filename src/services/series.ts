import { createClient } from '@/lib/supabase/client';
import {
  GamePlatform,
  Series,
  SeriesFormType,
  Team,
  LeagueSchedule,
  SeriesWithDetails
} from '@/lib/types';
import { handleError } from '@/services/utils/errorHandler';
import { deleteFile, uploadFile } from '@/services/utils/storage';

//====================
// Series API
//====================

//========
// CREATE
//========

export const createSeries = async (series: SeriesFormType): Promise<Series | null> => {
  const supabase = createClient();
  let processedSeries = {
    league_schedule_id: series.league_schedule.id,
    series_type: series.series_type,
    team_a_id: series.team_a.id,
    team_a_score: series.team_a_score,
    team_a_status: series.team_a_status,
    team_b_id: series.team_b.id,
    team_b_score: series.team_b_score,
    team_b_status: series.team_b_status,
    week: series.week,
    status: series.status,
    platform_id: series.platform.id,
    start_time: `${series.date} ${series.start_time}:00`,
    end_time: `${series.date} ${series.end_time}:00`
  };

  const { data, error } = await supabase.from('series').insert([processedSeries]).select().single();

  if (error) {
    handleError(error, 'creating series');
    return null;
  }

  return data as Series;
};

//========
// READ
//========

export const getSeriesCount = async (): Promise<number | null> => {
  const supabase = createClient();
  const { count, error } = await supabase
    .from('series')
    .select('*', { count: 'exact', head: true });

  if (error) {
    handleError(error, 'fetching series count');
    return null;
  }

  return count;
};

export const getAllSeries = async (): Promise<Series[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('series').select('*');

  if (error) {
    handleError(error, 'fetching series');
    return [];
  }

  return data || [];
};

export const getSeriesById = async (id: string): Promise<Series | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('series').select('*').eq('id', id).select().single();

  if (error) {
    handleError(error, `fetching series`);
    return null;
  }

  return data;
};

export const getSeriesByIndexRange = async (min: number, max: number): Promise<Series[]> => {
  const supabase = createClient();

  const { data, error } = await supabase.from('series').select('*').range(min, max);

  if (error) {
    handleError(error, 'fetching series');
    return [];
  }

  return data as Series[];
};

export const getSeriesByLeagueScheduleId = async (
  league_schedule_id: string
): Promise<Series[]> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('series')
    .select('*')
    .eq('league_schedule_id', league_schedule_id)
    .order('start_time');

  if (error) {
    handleError(error, 'fetching series');
    return [];
  }

  return data as Series[];
};

export const getSeriesByLeagueScheduleIdAndGamePlatform = async (
  league_schedule_id: string,
  platform_id: string
): Promise<Series[]> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('series')
    .select('*')
    .eq('league_schedule_id', league_schedule_id)
    .eq('platform_id', platform_id)
    .order('start_time')
    .order('match_number');

  if (error) {
    handleError(error, 'fetching series');
    return [];
  }

  return data as Series[];
};

export const getLatestSeries = async (): Promise<Series | null> => {
  const supabase = createClient();
  const dateToday = new Date().toISOString();

  const { data, error } = await supabase
    .from('series')
    .select('*')
    .lt('start_time', dateToday)
    .order('start_time', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    handleError(error, 'fetching latest past series');
    return null;
  }

  return data as Series;
};

//========
// UTILITY
//========

export const appendSeriesDetails = (
  platformList: GamePlatform[],
  teamList: Team[],
  leagueScheduleList: LeagueSchedule[],
  series: Series
) => {
  return {
    ...series,
    platform: platformList.find((platform) => platform.id === series.platform_id),
    team_a: teamList.find((team) => team.id === series.team_a_id),
    team_b: teamList.find((team) => team.id === series.team_b_id),
    league_schedule: leagueScheduleList.find(
      (schedule) => schedule.id === series.league_schedule_id
    )
  } as SeriesWithDetails;
};

export const shortenSeriesName = (series: SeriesWithDetails | Series) => {
  return `${series.start_time}`;
};

//========
// UPDATE
//========

export const updateSeriesById = async (
  id: string,
  updates: SeriesFormType
): Promise<Series | null> => {
  const supabase = createClient();
  let processedSeries = {
    league_schedule_id: updates.league_schedule.id,
    series_type: updates.series_type,
    team_a_id: updates.team_a.id,
    team_a_score: updates.team_a_score,
    team_a_status: updates.team_a_status,
    team_b_id: updates.team_b.id,
    team_b_score: updates.team_b_score,
    team_b_status: updates.team_b_status,
    match_number: updates.match_number,
    week: updates.week,
    status: updates.status,
    platform_id: updates.platform.id,
    start_time: `${updates.date} ${updates.start_time}:00`,
    end_time: `${updates.date} ${updates.end_time}:00`
  };

  const { data, error } = await supabase
    .from('series')
    .update(processedSeries)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    handleError(error, `updating series`);
    return null;
  }

  return data;
};

//========
// DELETE
//========

export const deleteSeriesById = async (id: string): Promise<boolean> => {
  const supabase = createClient();
  const { error } = await supabase.from('series').delete().eq('id', id).single();

  if (error) {
    handleError(error, `deleting series`);
    return false;
  }

  return true;
};
