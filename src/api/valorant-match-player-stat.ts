import { createClient } from '@/lib/supabase/client';
import {
  SeriesWithDetails,
  ValorantMatch,
  ValorantMap,
  ValorantMatchWithDetails,
  Series,
  ValorantMatchesPlayerStats,
  ValorantCompiledStats
} from '@/lib/types';
import { handleError } from '@/api/utils/errorHandler';

//====================
// Valorant Match Player Stat API
//====================

//========
// CREATE
//========

export const createValorantMatchPlayerStat =
  async (stat: {}): Promise<ValorantMatchesPlayerStats | null> => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('valorant_matches_player_stats')
      .insert([stat])
      .select()
      .single();

    if (error) {
      handleError(error, 'creating Valorant Match player stat');
      return null;
    }

    return data;
  };

//========
// READ
//========

export const getValorantMatchPlayerStatCount = async (): Promise<number | null> => {
  const supabase = createClient();
  const { count, error } = await supabase
    .from('valorant_matches_player_stats')
    .select('*', { count: 'exact', head: true });

  if (error) {
    handleError(error, 'fetching Valorant Matches count');
    return null;
  }

  return count;
};

export const getAllValorantMatchPlayerStats = async (): Promise<ValorantMatchesPlayerStats[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('valorant_matches_player_stats').select('*');

  if (error) {
    handleError(error, 'fetching Valorant Matches');
    return [];
  }

  return data || [];
};

export const getValorantMatchPlayerStatById = async (
  id: string
): Promise<ValorantMatchesPlayerStats | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('valorant_matches_player_stats')
    .select('*')
    .eq('id', id)
    .select()
    .single();

  if (error) {
    handleError(error, `fetching Valorant Match`);
    return null;
  }

  return data;
};

export const getValorantMatchPlayerStatByIndexRange = async (
  min: number,
  max: number
): Promise<ValorantMatchesPlayerStats[]> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('valorant_matches_player_stats')
    .select('*')
    .range(min, max);

  if (error) {
    handleError(error, 'fetching Valorant Matches');
    return [];
  }

  return data;
};

export const getValorantMatchPlayerStatByPlayerId = async (
  player_id: string
): Promise<ValorantMatchesPlayerStats[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('valorant_matches_player_stats')
    .select('*')
    .eq('player_id', player_id);

  if (error) {
    handleError(error, 'fetching compiled data stats');
    return [];
  }

  return data;
};

export const getValorantMatchPlayerStatByMatchId = async (match_id: string): Promise<ValorantMatchesPlayerStats[]> => {
  const supabase = createClient();
  const { data, error} = await supabase
    .from('valorant_matches_player_stats')
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

export const appendValorantMatchPlayerStatDetails = (
  seriesList: Series[],
  mapList: ValorantMap[],
  valorantMatch: ValorantMatch
) => {
  return {
    ...valorantMatch,
    series: seriesList.find((series) => series.id === valorantMatch.series_id),
    map: mapList.find((map) => map.id === valorantMatch.map_id)
  } as ValorantMatchWithDetails;
};

//========
// UPDATE
//========

export const updateValorantMatchPlayerStat = async (
  id: string,
  updates: {}
): Promise<ValorantMatchesPlayerStats | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('valorant_matches_player_stats')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    handleError(error, `updating Valorant Match`);
    return null;
  }

  return data;
};

//========
// DELETE
//========

export const deleteValorantMatchPlayerStatById = async (id: string): Promise<boolean> => {
  const supabase = createClient();
  const { error } = await supabase
    .from('valorant_matches_player_stats')
    .delete()
    .eq('id', id)
    .single();

  if (error) {
    handleError(error, `deleting Valorant Match`);
    return false;
  }

  return true;
};
