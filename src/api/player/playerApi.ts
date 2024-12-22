import { createClient } from '@/lib/supabase/client';
import { Player, PlayerWithDetails } from '@/lib/types';
import { getTeamById, getLeagueScheduleById,  getGamePlatformById } from '@/api';
import { handleError } from '@/api/utils/errorHandler';

//====================
// Player API
//====================

//========
// CREATE
//========

/**
 * Creates a new player in the database.
 * 
 * @param {Player} player - The player object to create.
 * @returns {Promise<player | null>} A promise that resolves to the created player object.
 * Returns null if an error occurs.
 */
export const postPlayer = async (player: Player): Promise<Player | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('players').insert([player]).single();

  if (error) {
    handleError(error, 'creating player');
    return null; // Return null if there is an error
  }

  return data;
};

//========
// READ
//========

/**
 * Fetches all player from the database, ordered by start time.
 * 
 * @returns {Promise<player[]>} A promise that resolves to an array of player objects.
 * If there is an error during the fetch, an empty array is returned.
 */
export const getAllPlayers = async (): Promise<Player[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('players')
    .select('*')

  if (error) {
    handleError(error, 'fetching all player');
    return [];
  }

  return data || [];
};

/**
 * Fetches a player by its ID.
 * 
 * @param {string} id - The ID of the player to fetch.
 * @returns {Promise<player | null>} A promise that resolves to a player object.
 * If no player is found or there is an error, null is returned.
 */
export const getPlayerById = async (id: string): Promise<Player | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    handleError(error, `fetching player by ID: ${id}`);
    return null; // Return null if there is an error
  }

  return data;
};

/**
 * Fetches all player along with their details, including teams and schedules.
 * 
 * @returns {Promise<playerWithDetails[]>} A promise that resolves to an array of playerWithDetails objects.
 * Each object includes detailed information about the player, teams, and platform.
 */
export const getAllPlayersWithDetails = async (): Promise<PlayerWithDetails[]> => {
  const playerList = await getAllPlayers();
  const playerListWithDetails: PlayerWithDetails[] = [];

  await Promise.all(
    playerList.map(async (player) => {
      const team = await getTeamById(player.team_id);
      const gamePlatform = await getGamePlatformById(player.game_platform_id);

      playerListWithDetails.push({
        ...player,
        team: team || null,
        platform: gamePlatform || null,
      });
    })
  );

  return playerListWithDetails;
};

//========
// UPDATE
//========

/**
 * Updates an existing player by its ID.
 * 
 * @param {string} id - The ID of the player to update.
 * @param {Partial<player>} updates - An object containing the fields to update.
 * @returns {Promise<player | null>} A promise that resolves to the updated player object.
 * Returns null if no player is found or an error occurs.
 */
export const updatePlayer = async (id: string, updates: Partial<Player>): Promise<Player | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('players')
    .update(updates)
    .eq('id', id)
    .single();

  if (error) {
    handleError(error, `updating player by ID: ${id}`);
    return null; // Return null if there is an error
  }

  return data;
};

//========
// DELETE
//========

/**
 * Deletes a player by its ID.
 * 
 * @param {string} id - The ID of the player to delete.
 * @returns {Promise<boolean>} A promise that resolves to true if the deletion was successful, or false if an error occurs.
 */
export const deletePlayer = async (id: string): Promise<boolean> => {
  const supabase = createClient();
  const { error } = await supabase
    .from('players')
    .delete()
    .eq('id', id);

  if (error) {
    handleError(error, `deleting player by ID: ${id}`);
    return false; // Return false if there is an error
  }

  return true; // Return true if the deletion was successful
};
