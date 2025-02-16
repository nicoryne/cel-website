import { createClient } from '@/lib/supabase/client';
import { LeagueSchedulePlayers, PlayerLeagueSchedules } from '@/lib/types';
import { handleError } from '@/api/utils/errorHandler';

//====================
// Player API
//====================

//========
// CREATE
//========

export const createPlayerLeagueSchedule = async (
  player_id: string,
  league_schedule_id: string
): Promise<PlayerLeagueSchedules | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('player_league_schedules')
    .insert([{ player_id, league_schedule_id }])
    .select()
    .single();

  if (error) {
    handleError(error, 'creating player league schedule');
    return null;
  }

  return data as PlayerLeagueSchedules;
};

//========
// READ
//========

export const getPlayerLeagueSchedulesByPlayer = async (
  player_id: string
): Promise<PlayerLeagueSchedules[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('player_league_schedules')
    .select('league_schedule_id')
    .eq('player_id', player_id);

  if (error) {
    handleError(error, 'fetching player league schedules');
    return [];
  }

  return data || [];
};

export const getPlayerLeagueSchedulesByLeagueSchedules = async (
  league_schedule_id: string
): Promise<LeagueSchedulePlayers[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('player_league_schedules')
    .select('player_id')
    .eq('league_schedule_id', league_schedule_id);

  if (error) {
    handleError(error, 'fetching player league schedules');
    return [];
  }

  return data || [];
};

//========
// DELETE
//========

export const deletePlayerLeagueSchedule = async (
  player_id: string,
  league_schedule_id: string
): Promise<boolean> => {
  const supabase = createClient();
  const { error } = await supabase
    .from('players')
    .delete()
    .eq('player_id', player_id)
    .eq('league_schedule_id', league_schedule_id)
    .select()
    .single();

  if (error) {
    handleError(error, `deleting player league schedule`);
    return false;
  }

  return true;
};
