import { createClient } from '@/lib/supabase/client';
import { GamePlatform, Player, PlayerFormType, Team } from '@/lib/types';
import { handleError } from '@/api/utils/errorHandler';
import { deleteFile, uploadFile } from '@/api/utils/storage';

//====================
// Game Platforms API
//====================

//========
// CREATE
//========

export const createPlayer = async (player: PlayerFormType): Promise<Player | null> => {
  const supabase = createClient();
  let processedPlayer = {
    first_name: player.first_name,
    last_name: player.last_name,
    ingame_name: player.ingame_name,
    team_id: player.team.id,
    game_platform_id: player.game_platform.id,
    roles: player.roles,
    picture_url: ''
  };

  if (player.picture) {
    const filePath = 'images/icons/players';
    const fileName = `${player.ingame_name}_${Date.now()}.${player.picture.type.split('/')[1]}`;
    const signedLogoUrl = await uploadFile(filePath, fileName, player.picture, true);

    if (signedLogoUrl) {
      processedPlayer.picture_url = signedLogoUrl;
    }
  }

  const { data, error } = await supabase.from('players').insert([processedPlayer]).select().single();

  if (error) {
    handleError(error, 'creating player');
    return null;
  }

  return data as Player;
};

//========
// READ
//========

export const getPlayerCount = async (): Promise<number | null> => {
  const supabase = createClient();
  const { count, error } = await supabase.from('players').select('*', { count: 'exact', head: true });

  if (error) {
    handleError(error, 'fetching player count');
    return null;
  }

  return count;
};

export const getAllPlayers = async (): Promise<Player[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('players').select('*');

  if (error) {
    handleError(error, 'fetching players');
    return [];
  }

  return data || [];
};

export const getPlayerById = async (id: string): Promise<Player | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('players').select('*').eq('id', id).select().single();

  if (error) {
    handleError(error, `fetching player by ID: ${id}`);
    return null;
  }

  return data;
};

export const getPlayerByName = async (name: string): Promise<Player | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('players').select('*').textSearch('ingame_name', name).single();

  if (error) {
    handleError(error, `fetching player by ingame name: ${name}`);
    return null;
  }

  return data as Player;
};

export const getPlayersByIndexRange = async (min: number, max: number): Promise<Player[]> => {
  const supabase = createClient();

  const { data, error } = await supabase.from('players').select('*').range(min, max);

  if (error) {
    handleError(error, 'fetching players by index range');
    return [];
  }

  return data as Player[];
};

//========
// UTILITY
//========

export const appendPlayerDetails = (platformList: GamePlatform[], teamList: Team[], player: Player) => {
  return {
    ...player,
    platform: platformList.find((platform) => platform.id === player.game_platform_id) || null,
    team: teamList.find((team) => team.id === player.team_id) || null
  };
};

//========
// UPDATE
//========

export const updatePlayerById = async (id: string, updates: PlayerFormType): Promise<Player | null> => {
  const supabase = createClient();
  let processedPlayer = {
    first_name: updates.first_name,
    last_name: updates.last_name,
    ingame_name: updates.ingame_name,
    team_id: updates.team.id,
    game_platform_id: updates.game_platform.id,
    roles: updates.roles,
    picture_url: ''
  };

  if (updates.picture) {
    const filePath = 'images/icons/players';
    const fileName = `${updates.ingame_name}_${Date.now()}.${updates.picture.type.split('/')[1]}`;
    const signedLogoUrl = await uploadFile(filePath, fileName, updates.picture, true);

    if (signedLogoUrl) {
      processedPlayer.picture_url = signedLogoUrl;
    }
  }

  const { data, error } = await supabase.from('players').update(processedPlayer).eq('id', id).select().single();

  if (error) {
    handleError(error, `updating Player by ID: ${id}`);
    return null;
  }

  return data;
};

//========
// DELETE
//========

export const deletePlayerById = async (id: string): Promise<boolean> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('players').delete().eq('id', id).select().single();

  if (data.logo_url) {
    const url = new URL(data.logo_url);
    const fileName = url.pathname.replace('/storage/v1/object/sign/images/', '');
    try {
      await deleteFile('images', [fileName]);
    } catch (error) {
      handleError(error, `deleting logo url from Player: ${id}`);
    }
  }

  if (error) {
    handleError(error, `deleting Player by ID: ${id}`);
    return false;
  }

  return true;
};
