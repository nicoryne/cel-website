import { createClient } from '@/lib/supabase/client';
import { MlbbMatch, MlbbMatchWithDetails, Series } from '@/lib/types';
import { handleError } from '@/services/utils/errorHandler';

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

export const getMlbbMatchBySeries = async (series_id: string): Promise<Series[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('mlbb_matches')
    .select('*')
    .eq('series_id', series_id);

  if (error) {
    handleError(error, 'fetching MLBB Matches');
    return [];
  }

  return data;
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
    handleError(error, `fetching MLBB Match`);
    return null;
  }

  return data;
};

export async function getVictoryAverageMatchDuration(teamId: string, leagueScheduleId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('mlbb_matches')
    .select(
      `
      team_a_status, 
      team_b_status,
      match_duration,
      series!inner (
        league_schedule_id,
        team_a_id,
        team_b_id
      )
    `
    )
    .eq('series.league_schedule_id', leagueScheduleId);

  if (error) {
    console.error('Error fetching victory match data:', error);
    return null;
  }

  let totalDurationInSeconds = 0;
  let matchCount = 0;

  data.forEach((match) => {
    const series = match.series as Partial<Series>;

    if (match.match_duration) {
      const [minutes, seconds] = match.match_duration.split(':').map(Number);
      const durationInSeconds = minutes * 60 + seconds;
      if (series?.team_a_id === teamId && match.team_a_status === 'Win') {
        totalDurationInSeconds += durationInSeconds;
        matchCount++;
      } else if (series?.team_b_id === teamId && match.team_b_status === 'Win') {
        totalDurationInSeconds += durationInSeconds;
        matchCount++;
      }
    }
  });

  if (matchCount === 0) return '00:00';

  const averageSeconds = Math.floor(totalDurationInSeconds / matchCount);
  const avgMinutes = Math.floor(averageSeconds / 60);
  const avgSeconds = averageSeconds % 60;

  return `${String(avgMinutes).padStart(2, '0')}:${String(avgSeconds).padStart(2, '0')}`;
}

export const getMlbbMatchByIndexRange = async (min: number, max: number): Promise<MlbbMatch[]> => {
  const supabase = createClient();

  const { data, error } = await supabase.from('mlbb_matches').select('*').range(min, max);

  if (error) {
    handleError(error, 'fetching MLBB Matches');
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
    handleError(error, `updating MLBB Match`);
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
    handleError(error, `deleting MLBB Match`);
    return false;
  }

  return true;
};
