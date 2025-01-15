import { createClient } from '@/lib/supabase/client';
import { LeagueSchedule } from '@/lib/types';
import { handleError } from '@/api/utils/errorHandler';

//====================
// League Schedule API
//====================

//========
// CREATE
//========

export const createLeagueSchedule = async (schedule: {}): Promise<LeagueSchedule | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('league_schedule').insert([schedule]).select().single();

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
  const { count, error } = await supabase.from('league_schedule').select('*', { count: 'exact', head: true });

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
    handleError(error, `fetching league schedule by ID: ${id}`);
    return null;
  }

  return data;
};

export const getLeagueSchedulesByIndexRange = async (min: number, max: number): Promise<LeagueSchedule[]> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('league_schedule')
    .select('*')
    .order('season_type', { ascending: true })
    .order('season_number', { ascending: true })
    .range(min, max);

  if (error) {
    handleError(error, 'fetching league schedule by index range');
    return [];
  }

  return data as LeagueSchedule[];
};

//========
// UPDATE
//========

export const updateLeagueScheduleById = async (
  id: string,
  updates: Partial<LeagueSchedule>
): Promise<LeagueSchedule | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('league_schedule').update(updates).eq('id', id).select().single();

  if (error) {
    handleError(error, `updating league schedule by ID: ${id}`);
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
    handleError(error, `deleting league schedule by ID: ${id}`);
    return false;
  }

  return true;
};
