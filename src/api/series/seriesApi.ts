'use server';
import { createClient } from '@/lib/supabase/client';
import { Series, SeriesWithDetails } from '@/lib/types';
import { getTeamById } from '@/api/team/teamApi';
import { getLeagueScheduleById } from '@/api/league/leagueApi';
import { getGamePlatformById } from '@/api/platform/platformApi';
import { handleError } from '@/api/utils/errorHandler';

//====================
// Series API
//====================

//========
// CREATE
//========

/**
 * Creates a new series in the database.
 * 
 * @param {Series} series - The series object to create.
 * @returns {Promise<Series | null>} A promise that resolves to the created Series object.
 * Returns null if an error occurs.
 */
export const createSeries = async (series: Series): Promise<Series | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('series').insert([series]).single();

  if (error) {
    handleError(error, 'creating series');
    return null; // Return null if there is an error
  }

  return data;
};

//========
// READ
//========

/**
 * Fetches all series from the database, ordered by start time.
 * 
 * @returns {Promise<Series[]>} A promise that resolves to an array of Series objects.
 * If there is an error during the fetch, an empty array is returned.
 */
export const getAllSeries = async (): Promise<Series[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('series')
    .select('*')
    .order('start_time', { ascending: true });

  if (error) {
    handleError(error, 'fetching all series');
    return [];
  }

  return data || [];
};

/**
 * Fetches a series by its ID.
 * 
 * @param {string} id - The ID of the series to fetch.
 * @returns {Promise<Series | null>} A promise that resolves to a Series object.
 * If no series is found or there is an error, null is returned.
 */
export const getSeriesById = async (id: string): Promise<Series | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('series')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    handleError(error, `fetching Series by ID: ${id}`);
    return null; // Return null if there is an error
  }

  return data;
};

/**
 * Fetches all series along with their details, including teams and schedules.
 * 
 * @returns {Promise<SeriesWithDetails[]>} A promise that resolves to an array of SeriesWithDetails objects.
 * Each object includes detailed information about the series, teams, and platform.
 */
export const getAllSeriesWithDetails = async (): Promise<SeriesWithDetails[]> => {
  const seriesList = await getAllSeries();
  const seriesListWithDetails: SeriesWithDetails[] = [];

  await Promise.all(
    seriesList.map(async (series) => {
      const teamA = await getTeamById(series.team_a_id);
      const teamB = await getTeamById(series.team_b_id);
      const leagueSchedule = await getLeagueScheduleById(series.league_schedule_id);
      const gamePlatform = await getGamePlatformById(series.platform_id);

      seriesListWithDetails.push({
        ...series,
        league_schedule: leagueSchedule,
        team_a: teamA || null,
        team_b: teamB || null,
        platform: gamePlatform || null,
      });
    })
  );

  return seriesListWithDetails;
};

//========
// UPDATE
//========

/**
 * Updates an existing series by its ID.
 * 
 * @param {string} id - The ID of the series to update.
 * @param {Partial<Series>} updates - An object containing the fields to update.
 * @returns {Promise<Series | null>} A promise that resolves to the updated Series object.
 * Returns null if no series is found or an error occurs.
 */
export const updateSeries = async (id: string, updates: Partial<Series>): Promise<Series | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('series')
    .update(updates)
    .eq('id', id)
    .single();

  if (error) {
    handleError(error, `updating series by ID: ${id}`);
    return null; // Return null if there is an error
  }

  return data;
};

//========
// DELETE
//========

/**
 * Deletes a series by its ID.
 * 
 * @param {string} id - The ID of the series to delete.
 * @returns {Promise<boolean>} A promise that resolves to true if the deletion was successful, or false if an error occurs.
 */
export const deleteSeries = async (id: string): Promise<boolean> => {
  const supabase = createClient();
  const { error } = await supabase
    .from('series')
    .delete()
    .eq('id', id);

  if (error) {
    handleError(error, `deleting series by ID: ${id}`);
    return false; // Return false if there is an error
  }

  return true; // Return true if the deletion was successful
};
