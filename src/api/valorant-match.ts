import { createClient } from '@/lib/supabase/client';
import {
  SeriesWithDetails,
  ValorantMatch,
  ValorantMap,
  ValorantMatchWithDetails,
  Series
} from '@/lib/types';
import { handleError } from '@/api/utils/errorHandler';

//====================
// Valorant Match API
//====================

//========
// CREATE
//========

export const createValorantMatch = async (match: {}): Promise<ValorantMatch | null> => {
  const supabase = createClient();

  const { data, error } = await supabase.from('valorant_matches').insert([match]).select().single();

  if (error) {
    handleError(error, 'creating Valorant Match');
    return null;
  }

  return data as ValorantMatch;
};

//========
// READ
//========

export const doesValorantMatchExist = async (
  series_id: string,
  match_number: number
): Promise<boolean | null> => {
  const supabase = createClient();

  const { count, error } = await supabase
    .from('valorant_matches')
    .select('*', { count: 'exact', head: true })
    .eq('series_id', series_id)
    .eq('match_number', match_number);

  if (error) {
    handleError(error, 'fetching Valorant Match exist');
    return null;
  }

  return count ? count > 0 : false;
};

export const getValorantMatchCount = async (): Promise<number | null> => {
  const supabase = createClient();
  const { count, error } = await supabase
    .from('valorant_matches')
    .select('*', { count: 'exact', head: true });

  if (error) {
    handleError(error, 'fetching Valorant Matches count');
    return null;
  }

  return count;
};

export const getAllValorantMatches = async (): Promise<ValorantMatch[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('valorant_matches').select('*');

  if (error) {
    handleError(error, 'fetching Valorant Matches');
    return [];
  }

  return data || [];
};

export const getValorantMatchById = async (id: string): Promise<ValorantMatch | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('valorant_matches')
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

export const getValorantMatchByIndexRange = async (
  min: number,
  max: number
): Promise<ValorantMatch[]> => {
  const supabase = createClient();

  const { data, error } = await supabase.from('valorant_matches').select('*').range(min, max);

  if (error) {
    handleError(error, 'fetching Valorant Matches');
    return [];
  }

  return data as ValorantMatch[];
};

//========
// UTILITY
//========

export const appendValorantMatchDetails = (
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

export const updateValorantMatch = async (
  id: string,
  updates: {}
): Promise<ValorantMatch | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('valorant_matches')
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

export const deleteValorantMatchById = async (id: string): Promise<boolean> => {
  const supabase = createClient();
  const { error } = await supabase.from('valorant_matches').delete().eq('id', id).single();

  if (error) {
    handleError(error, `deleting Valorant Match`);
    return false;
  }

  return true;
};
