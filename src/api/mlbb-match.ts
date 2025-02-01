import { createClient } from '@/lib/supabase/client';
import { MlbbMatch, MlbbMatchWithDetails, Series } from '@/lib/types';
import { handleError } from '@/api/utils/errorHandler';

//====================
// Mlbb Match API
//====================

//========
// CREATE
//========

export const createMlbbMatch = async (match: {}): Promise<MlbbMatch | null> => {
  const supabase = createClient();

  const { data, error } = await supabase.from('mlbb_matches').insert([match]).select().single();

  if (error) {
    handleError(error, 'creating MLBB Match');
    return null;
  }

  return data as MlbbMatch;
};

//========
// READ
//========

export const doesMlbbMatchExist = async (
  series_id: string,
  match_number: number
): Promise<boolean | null> => {
  const supabase = createClient();

  const { count, error } = await supabase
    .from('mlbb_matches')
    .select('*', { count: 'exact', head: true })
    .eq('series_id', series_id)
    .eq('match_number', match_number);

  if (error) {
    handleError(error, 'fetching MLBB Match exist');
    return null;
  }

  return count ? count > 0 : false;
};

export const getMlbbMatchCount = async (): Promise<number | null> => {
  const supabase = createClient();
  const { count, error } = await supabase
    .from('mlbb_matches')
    .select('*', { count: 'exact', head: true });

  if (error) {
    handleError(error, 'fetching MLBB Matches count');
    return null;
  }

  return count;
};

export const getAllMlbbMatches = async (): Promise<MlbbMatch[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('mlbb_matches').select('*');

  if (error) {
    handleError(error, 'fetching MLBB Matches');
    return [];
  }

  return data || [];
};

export const getMlbbMatchById = async (id: string): Promise<MlbbMatch | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('mlbb_matches')
    .select('*')
    .eq('id', id)
    .select()
    .single();

  if (error) {
    handleError(error, `fetching MLBB Match by ID: ${id}`);
    return null;
  }

  return data;
};

export const getMlbbMatchByIndexRange = async (min: number, max: number): Promise<MlbbMatch[]> => {
  const supabase = createClient();

  const { data, error } = await supabase.from('mlbb_matches').select('*').range(min, max);

  if (error) {
    handleError(error, 'fetching MLBB Matches by index range');
    return [];
  }

  return data as MlbbMatch[];
};

//========
// UTILITY
//========

export const appendMlbbMatchDetails = (seriesList: Series[], mlbbMatch: MlbbMatch) => {
  return {
    ...mlbbMatch,
    series: seriesList.find((series) => series.id === mlbbMatch.series_id)
  } as MlbbMatchWithDetails;
};

//========
// UPDATE
//========

export const updateMlbbMatch = async (id: string, updates: {}): Promise<MlbbMatch | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('mlbb_matches')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    handleError(error, `updating MLBB Match by ID: ${id}`);
    return null;
  }

  return data;
};

//========
// DELETE
//========

export const deleteMlbbMatchById = async (id: string): Promise<boolean> => {
  const supabase = createClient();
  const { error } = await supabase.from('mlbb_matches').delete().eq('id', id).single();

  if (error) {
    handleError(error, `deleting MLBB Match by ID: ${id}`);
    return false;
  }

  return true;
};
