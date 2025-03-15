import { createClient } from '@/lib/supabase/client';
import { LeagueSchedule, SeasonInfo } from '@/lib/types';
import { handleError } from '@/services/utils/errorHandler';

//====================
// League Schedule API
//====================

//========
// CREATE
//========

export const createLeagueSchedule = async (schedule: {}): Promise<LeagueSchedule | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('league_schedule')
    .insert([schedule])
    .select()
    .single();

  if (error) {
    handleError(error, 'creating league schedule');
    return null;
  }

  return data as LeagueSchedule;
};

//========
// READ
//========

export const getAllLeagueSchedules = async (): Promise<LeagueSchedule[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('league_schedule').select('*');

  if (error) {
    handleError(error, `fetching all league schedules`);
    return [];
  }

  return data || [];
};

export const getScheduleCount = async (): Promise<number | null> => {
  const supabase = createClient();
  const { count, error } = await supabase
    .from('league_schedule')
    .select('*', { count: 'exact', head: true });

  if (error) {
    handleError(error, 'fetching schedule count');
    return null;
  }

  return count;
};

export const getLeagueScheduleById = async (id: string): Promise<LeagueSchedule | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('league_schedule').select('*').eq('id', id).single();

  if (error) {
    handleError(error, `fetching league schedule`);
    return null;
  }

  return data;
};

export const getLeagueSchedulesByIndexRange = async (
  min: number,
  max: number
): Promise<LeagueSchedule[]> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('league_schedule')
    .select('*')
    .order('season_type', { ascending: true })
    .order('season_number', { ascending: true })
    .range(min, max);

  if (error) {
    handleError(error, 'fetching league schedule');
    return [];
  }

  return data as LeagueSchedule[];
};

export const getLatestLeagueSchedule = async (): Promise<LeagueSchedule | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('league_schedule')
    .select('*')
    .order('end_date', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    handleError(error, 'fetching latest league schedule');
    return null;
  }

  return data;
};

export const getLeagueStageByTypeAndNumber = async (
  season_type: string,
  season_number: number
): Promise<string[]> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('league_schedule')
    .select('league_stage')
    .eq('season_type', season_type)
    .eq('season_number', season_number)
    .order('end_date', { ascending: true });

  if (error) {
    handleError(error, 'fetching league schedule');
    return [];
  }

  return (data || []).map((item) => item.league_stage);
};

export const getLeagueScheduleByTypeNumberStage = async (
  season_type: string,
  season_number: number,
  league_stage: string
): Promise<LeagueSchedule | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('league_schedule')
    .select('*')
    .eq('season_type', season_type)
    .eq('season_number', season_number)
    .eq('league_stage', league_stage)
    .single();

  if (error) {
    handleError(error, 'fetching league schedule');
    return null;
  }

  return data;
};

//========
// UPDATE
//========

export const updateLeagueScheduleById = async (
  id: string,
  updates: Partial<LeagueSchedule>
): Promise<LeagueSchedule | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('league_schedule')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    handleError(error, `updating league schedule`);
    return null;
  }

  return data as LeagueSchedule;
};

//========
// DELETE
//========

export const deleteLeagueScheduleById = async (id: string): Promise<boolean> => {
  const supabase = createClient();
  const { error } = await supabase.from('league_schedule').delete().eq('id', id);

  if (error) {
    handleError(error, `deleting league schedule`);
    return false;
  }

  return true;
};
