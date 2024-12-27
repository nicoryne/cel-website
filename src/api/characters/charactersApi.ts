import { createClient } from '@/lib/supabase/client';
import { Character, CharacterWithDetails } from '@/lib/types';
import { handleError } from '@/api/utils/errorHandler';
import { getGamePlatformById } from '@/api';

//==================
// Character API
//==================

//========
// CREATE
//========

/**
 * Creates a new character.
 * 
 * @param {Character} character - The character object to create.
 * @returns {Promise<Character | null>} A promise that resolves to the created Character object.
 * Returns null if an error occurs.
 */
export const createCharacter = async (character: {}): Promise<{} | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('game_characters').insert([character]).single();

  if (error) {
    handleError(error, 'creating character');
    return null;
  }

  return data;
};

//========
// READ
//========

/**
 * Fetches all characters from the database.
 * 
 * @returns {Promise<Character[]>} A promise that resolves to an array of Character objects.
 * If there is an error during the fetch, an empty array is returned.
 */
export const getAllCharacters = async (): Promise<Character[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('game_characters').select('*');

  if (error) {
    handleError(error, 'fetching all characters');
    return [];
  }

  return data || [];
};

/**
 * Fetches a character by its ID.
 * 
 * @param {string} id - The ID of the character to fetch.
 * @returns {Promise<CharacterWithDetails | null>} A promise that resolves to a CharacterWithDetails object.
 * If no character is found or there is an error, null is returned.
 */
export const getCharacterById = async (id: string): Promise<CharacterWithDetails | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('game_characters')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    handleError(error, `fetching character by ID: ${id}`);
    return null;
  }

  return data;
};

/**
 * Fetches all characters along with their details.
 * 
 * @returns {Promise<CharacterWithDetails[]>} A promise that resolves to an array of CharactersWithDetails objects.
 * Each object includes detailed information about the character.
 */
export const getAllCharactersWithDetails = async (): Promise<CharacterWithDetails[]> => {
  const charactersList = await getAllCharacters();
  const charactersListWithDetails: CharacterWithDetails[] = [];

  await Promise.all(
    charactersList.map(async (character) => {
      const gamePlatform = await getGamePlatformById(character.platform_id);

      charactersListWithDetails.push({
        ...character,
        platform: gamePlatform || null,
      });
    })
  );

  return charactersListWithDetails;
};

//========
// UPDATE
//========

/**
 * Updates an existing character by its ID.
 * 
 * @param {string} id - The ID of the character to update.
 * @param {Partial<Character>} updates - An object containing the fields to update.
 * @returns {Promise<Character | null>} A promise that resolves to the updated Character object.
 * Returns null if no character is found or an error occurs.
 */
export const updateCharacter = async (id: string, updates: Partial<Character>): Promise<Character | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('game_characters')
    .update(updates)
    .eq('id', id)
    .single();

  if (error) {
    handleError(error, `updating character by ID: ${id}`);
    return null; 
  }

  return data;
};

//========
// DELETE
//========

/**
 * Deletes a character by its ID.
 * 
 * @param {string} id - The ID of the character to delete.
 * @returns {Promise<boolean>} A promise that resolves to true if the deletion was successful, or false if an error occurs.
 */
export const deleteCharacter = async (id: string): Promise<boolean> => {
  const supabase = createClient();
  const { error } = await supabase
    .from('game_characters')
    .delete()
    .eq('id', id);

  if (error) {
    handleError(error, `deleting character by ID: ${id}`);
    return false;
  }

  return true;
};
