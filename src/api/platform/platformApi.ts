'use server';
import { createClient } from '@/lib/supabase/client';
import { GamePlatform } from '@/lib/types';
import { handleError } from '@/api/utils/errorHandler';

//====================
// Game Platforms API
//====================

//========
// CREATE
//========

/**
 * Creates a new game platform.
 * 
 * @param {GamePlatform} platform - The game platform object to create.
 * @returns {Promise<GamePlatform | null>} A promise that resolves to the created GamePlatform object.
 * Returns null if an error occurs.
 */
export const createGamePlatform = async (platform: GamePlatform): Promise<GamePlatform | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('game_platforms').insert([platform]).single();

  if (error) {
    handleError(error, 'creating game platform');
    return null; // Return null if there is an error
  }

  return data;
};

//========
// READ
//========

/**
 * Fetches all game platforms from the database.
 * 
 * @returns {Promise<GamePlatform[]>} A promise that resolves to an array of GamePlatform objects.
 * If there is an error during the fetch, an empty array is returned.
 */
export const getAllGamePlatforms = async (): Promise<GamePlatform[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('game_platforms').select('*');

  if (error) {
    handleError(error, 'fetching game platforms');
    return [];
  }

  return data || [];
};

/**
 * Fetches a game platform by its ID.
 * 
 * @param {string} id - The ID of the game platform to fetch.
 * @returns {Promise<GamePlatform | null>} A promise that resolves to a GamePlatform object.
 * If no game platform is found or there is an error, null is returned.
 */
export const getGamePlatformById = async (id: string): Promise<GamePlatform | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('game_platforms')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    handleError(error, `fetching game platform by ID: ${id}`);
    return null; // Return null if there is an error
  }

  return data;
};

//========
// UPDATE
//========

/**
 * Updates an existing game platform by its ID.
 * 
 * @param {string} id - The ID of the game platform to update.
 * @param {Partial<GamePlatform>} updates - An object containing the fields to update.
 * @returns {Promise<GamePlatform | null>} A promise that resolves to the updated GamePlatform object.
 * Returns null if no game platform is found or an error occurs.
 */
export const updateGamePlatform = async (id: string, updates: Partial<GamePlatform>): Promise<GamePlatform | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('game_platforms')
    .update(updates)
    .eq('id', id)
    .single();

  if (error) {
    handleError(error, `updating game platform by ID: ${id}`);
    return null; // Return null if there is an error
  }

  return data;
};

//========
// DELETE
//========

/**
 * Deletes a game platform by its ID.
 * 
 * @param {string} id - The ID of the game platform to delete.
 * @returns {Promise<boolean>} A promise that resolves to true if the deletion was successful, or false if an error occurs.
 */
export const deleteGamePlatform = async (id: string): Promise<boolean> => {
  const supabase = createClient();
  const { error } = await supabase
    .from('game_platforms')
    .delete()
    .eq('id', id);

  if (error) {
    handleError(error, `deleting game platform by ID: ${id}`);
    return false; // Return false if there is an error
  }

  return true; // Return true if the deletion was successful
};
