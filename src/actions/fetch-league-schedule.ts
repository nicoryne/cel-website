'use server';
import { createClient } from '@/lib/supabase/client';
import { LeagueSchedule } from '@/lib/types';

export const getAllPlatforms = async (): Promise<LeagueSchedule[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('league_schedule').select('*');

  if (error) {
    console.error('🔴 Error fetching league schedules', error.message);
    return [];
  }

  return data || [];
};

export const getLeagueScheduleById = async (id: string): Promise<LeagueSchedule> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('league_schedule')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('🔴 Error fetching league schedule by ID:', error.message);
  }

  return data;
};