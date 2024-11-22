'use server';
import { createClient } from '@/lib/supabase/client';
import { Team } from '@/lib/types';
import { handleError } from '../utils/errorHandler';

//====================
// Team API
//====================

//========
// CREATE
//========

/**
 * Creates a new team in the database.
 * 
 * @param {Team} team - The team object to create.
 * @returns {Promise<Team | null>} A promise that resolves to the created Team object.
 * Returns null if an error occurs.
 */
export const createTeam = async (team: Team): Promise<Team | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('team').insert([team]).single();

  if (error) {
    handleError(error, 'creating team');
    return null; // Return null if there is an error
  }

  return data;
};

//========
// READ
//========

/**
 * Fetches all teams from the database.
 * 
 * @returns {Promise<Team[]>} A promise that resolves to an array of Team objects.
 * If there is an error during the fetch, an empty array is returned.
 */
export const getAllTeams = async (): Promise<Team[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('teams')
    .select('*')
    .not('school_abbrev', 'eq', 'TBD')
    .order('school_abbrev');

  if (error) {
    handleError(error, 'fetching all teams');
    return [];
  }

  return data || [];
};

/**
 * Fetches a team by its ID.
 * 
 * @param {string} id - The ID of the team to fetch.
 * @returns {Promise<Team | null>} A promise that resolves to a Team object.
 * If no team is found or there is an error, null is returned.
 */
export const getTeamById = async (id: string): Promise<Team | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    handleError(error, `fetching team by ID: ${id}`);
    return null; // Return null if there is an error
  }

  return data;
};

//========
// UPDATE
//========

/**
 * Updates an existing team by its ID.
 * 
 * @param {string} id - The ID of the team to update.
 * @param {Partial<Team>} updates - An object containing the fields to update.
 * @returns {Promise<Team | null>} A promise that resolves to the updated Team object.
 * Returns null if no team is found or an error occurs.
 */
export const updateTeam = async (id: string, updates: Partial<Team>): Promise<Team | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('teams')
    .update(updates)
    .eq('id', id)
    .single();

  if (error) {
    handleError(error, `updating team by ID: ${id}`);
    return null; // Return null if there is an error
  }

  return data;
};

//========
// DELETE
//========

/**
 * Deletes a team by its ID.
 * 
 * @param {string} id - The ID of the team to delete.
 * @returns {Promise<boolean>} A promise that resolves to true if the deletion was successful, or false if an error occurs.
 */
export const deleteTeam = async (id: string): Promise<boolean> => {
  const supabase = createClient();
  const { error } = await supabase
    .from('teams')
    .delete()
    .eq('id', id);

  if (error) {
    handleError(error, `deleting team by ID: ${id}`);
    return false; // Return false if there is an error
  }
  
  return true; // Return true if the deletion was successful
};
