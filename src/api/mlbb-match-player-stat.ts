import { createClient } from '@/lib/supabase/client';
import {
  MlbbMatch,
  MlbbMatchWithDetails,
  Series,
  MlbbMatchesPlayerStats,
  MlbbCompiledStats
} from '@/lib/types';
import { handleError } from '@/api/utils/errorHandler';

//====================
// MLBB Match Player Stat API
//====================

//========
// CREATE
//========

export const createMlbbMatchPlayerStat =
  async (stat: {}): Promise<MlbbMatchesPlayerStats | null> => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('mlbb_matches_player_stats')
      .insert([stat])
      .select()
      .single();

    if (error) {
      handleError(error, 'creating MLBB Match player stat');
      return null;
    }

    return data;
  };

//========
// READ
//========

export const getMlbbMatchPlayerStatCount = async (): Promise<number | null> => {
  const supabase = createClient();
  const { count, error } = await supabase
    .from('mlbb_matches_player_stats')
    .select('*', { count: 'exact', head: true });

  if (error) {
    handleError(error, 'fetching MLBB Matches count');
    return null;
  }

  return count;
};

export const getAllMlbbMatchPlayerStats = async (): Promise<MlbbMatchesPlayerStats[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('mlbb_matches_player_stats').select('*');

  if (error) {
    handleError(error, 'fetching MLBB Matches');
    return [];
  }

  return data || [];
};

export const getMlbbMatchPlayerStatById = async (
  player_id: string
): Promise<MlbbMatchesPlayerStats | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('mlbb_matches_player_stats')
    .select('*')
    .eq('player_id', player_id)
    .select()
    .single();

  if (error) {
    handleError(error, `fetching MLBB Match`);
    return null;
  }

  return data;
};

export const getMlbbMatchPlayerStatByIndexRange = async (
  min: number,
  max: number
): Promise<MlbbMatchesPlayerStats[]> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('mlbb_matches_player_stats')
    .select('*')
    .range(min, max);

  if (error) {
    handleError(error, 'fetching MLBB Matches');
    return [];
  }

  return data;
};

export const getMlbbCompiledStatsByPlayer = async (q_player_id: string): Promise<any | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_mlbb_compiled_stats_by_player', {
    q_player_id: q_player_id
  });

  console.log(data);
  if (error) {
    handleError(error, 'fetching compiled data stats');
    return null;
  }

  return data;
};

export const getMlbbMatchPlayerStatByPlayerId = async (
  player_id: string
): Promise<MlbbMatchesPlayerStats[] | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('mlbb_matches_player_stats')
    .select('*')
    .eq('player_id', player_id);

  if (error) {
    handleError(error, 'fetching compiled data stats');
    return null;
  }

  return data;
};


export const getMlbbMatchPlayerStatByMatch = async (match_id: string): Promise<MlbbMatchesPlayerStats[]> => {
  const supabase = createClient();
  const { data, error} = await supabase
    .from('mlbb_matches_player_stats')
    .select('*')
    .eq('match_id', match_id)

  if (error) {
    handleError(error, 'fetching compiled data stats');
    return [];
  }

  return data
}

//========
// UTILITY
//========

export const appendMlbbMatchPlayerStatDetails = (seriesList: Series[], mlbbMatch: MlbbMatch) => {
  return {
    ...mlbbMatch,
    series: seriesList.find((series) => series.id === mlbbMatch.series_id)
  } as MlbbMatchWithDetails;
};

//========
// UPDATE
//========

export const updateMlbbMatchPlayerStat = async (
  id: string,
  updates: {}
): Promise<MlbbMatchesPlayerStats | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('mlbb_matches_player_stats')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    handleError(error, `updating Mlbb Match`);
    return null;
  }

  return data;
};

//========
// DELETE
//========

export const deleteMlbbMatchPlayerStatById = async (id: string): Promise<boolean> => {
  const supabase = createClient();
  const { error } = await supabase.from('mlbb_matches_player_stats').delete().eq('id', id).single();

  if (error) {
    handleError(error, `deleting MLBB Match`);
    return false;
  }

  return true;
};
