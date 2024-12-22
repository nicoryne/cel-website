import { createClient } from '@/lib/supabase/client';
import { LeagueSchedule } from '@/lib/types';
import { handleError } from '@/api/utils/errorHandler';

//====================
// League Schedule API
//====================

//========
// CREATE
//========

/**
 * Creates a new league schedule.
 * 
 * @param {LeagueSchedule} schedule - The league schedule object to create.
 * @returns {Promise<LeagueSchedule | null>} A promise that resolves to the created LeagueSchedule object.
 * Returns null if an error occurs.
 */
export const createLeagueSchedule = async (schedule: LeagueSchedule): Promise<LeagueSchedule | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('league_schedule').insert([schedule]).single();

  if (error) {
    handleError(error, 'creating league schedule');
    return null; // Return null if there is an error
  }

  return data;
};

//========
// READ
//========

/**
 * Fetches all league schedules from the database.
 * 
 * @returns {Promise<LeagueSchedule[]>} A promise that resolves to an array of LeagueSchedule objects.
 * If there is an error during the fetch, an empty array is returned.
 */
export const getAllLeagueSchedules = async (): Promise<LeagueSchedule[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('league_schedule').select('*');

  if (error) {
    handleError(error, `fetching all league schedules`);
    return [];
  }

  return data || [];
};

/**
 * Fetches a league schedule by its ID.
 * 
 * @param {string} id - The ID of the league schedule to fetch.
 * @returns {Promise<LeagueSchedule | null>} A promise that resolves to a LeagueSchedule object.
 * If no schedule is found or there is an error, null is returned.
 */
export const getLeagueScheduleById = async (id: string): Promise<LeagueSchedule | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('league_schedule')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    handleError(error, `fetching league schedule by ID: ${id}`);
    return null; // Return null if there is an error
  }

  return data;
};

//========
// UPDATE
//========

/**
 * Updates an existing league schedule by its ID.
 * 
 * @param {string} id - The ID of the league schedule to update.
 * @param {Partial<LeagueSchedule>} updates - An object containing the fields to update.
 * @returns {Promise<LeagueSchedule | null>} A promise that resolves to the updated LeagueSchedule object.
 * Returns null if no schedule is found or an error occurs.
 */
export const updateLeagueSchedule = async (id: string, updates: Partial<LeagueSchedule>): Promise<LeagueSchedule | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('league_schedule')
    .update(updates)
    .eq('id', id)
    .single();

  if (error) {
    handleError(error, `updating league schedule by ID: ${id}`);
    return null; // Return null if there is an error
  }

  return data;
};

//========
// DELETE
//========

/**
 * Deletes a league schedule by its ID.
 * 
 * @param {string} id - The ID of the league schedule to delete.
 * @returns {Promise<boolean>} A promise that resolves to true if the deletion was successful, or false if an error occurs.
 */
export const deleteLeagueSchedule = async (id: string): Promise<boolean> => {
  const supabase = createClient();
  const { error } = await supabase
    .from('league_schedule')
    .delete()
    .eq('id', id);

  if (error) {
    handleError(error, `deleting league schedule by ID: ${id}`);
    return false; // Return false if there is an error
  }

  return true; // Return true if the deletion was successful
};
