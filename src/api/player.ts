import { createClient } from '@/lib/supabase/client';
import { GamePlatform, Player, PlayerFormType, Team } from '@/lib/types';
import { handleError } from '@/api/utils/errorHandler';
import { deleteFile, uploadFile } from '@/api/utils/storage';

//====================
// Player API
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
    platform_id: player.game_platform.id,
    roles: player.roles,
    picture_url: '',
    is_active: player.is_active
  };

  if (player.picture) {
    const filePath = 'images/icons/players';
    const fileName = `${player.ingame_name}_${Date.now()}.${player.picture.type.split('/')[1]}`;
    const signedLogoUrl = await uploadFile(filePath, fileName, player.picture, true);

    if (signedLogoUrl) {
      processedPlayer.picture_url = signedLogoUrl;
    }
  }

  const { data, error } = await supabase
    .from('players')
    .insert([processedPlayer])
    .select()
    .single();

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
  const { count, error } = await supabase
    .from('players')
    .select('*', { count: 'exact', head: true });

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
    handleError(error, `fetching player}`);
    return null;
  }

  return data;
};

export const getPlayerByName = async (name: string): Promise<Player | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .textSearch('ingame_name', name)
    .single();

  if (error) {
    handleError(error, `fetching player`);
    return null;
  }

  return data as Player;
};

export const getPlayersByIndexRange = async (min: number, max: number): Promise<Player[]> => {
  const supabase = createClient();

  const { data, error } = await supabase.from('players').select('*').range(min, max);

  if (error) {
    handleError(error, 'fetching players');
    return [];
  }

  return data as Player[];
};

export const getPlayerByTeamAndName = async (
  team_id: string,
  ingame_name: string
): Promise<Player | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('team_id', team_id)
    .ilike('ingame_name', ingame_name)
    .single();

  if (error) {
    handleError(error, 'fetching player');
    return null;
  }

  return data as Player;
};

export const getPlayersByPlatform = async (platform_id: string): Promise<Player[]> => {
  const supabase = createClient();

  const { data, error } = await supabase.from('players').select('*').eq('platform_id', platform_id);

  if (error) {
    handleError(error, 'fetching player');
    return [];
  }

  return data as Player[];
};

export const getPlayersByTeam = async (team_id: string): Promise<Player[]> => {
  const supabase = createClient();

  const { data, error } = await supabase.from('players').select('*').eq('team_id', team_id);

  if (error) {
    handleError(error, 'fetching player');
    return [];
  }

  return data as Player[];
};

export const getPlayersByTeamAndPlatform = async (
  team_id: string,
  platform_id: string
): Promise<Player[]> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('team_id', team_id)
    .eq('platform_id', platform_id);

  if (error) {
    handleError(error, 'fetching player');
    return [];
  }

  return data as Player[];
};

export const doesPlayerExist = async (first_name: string, last_name: string): Promise<boolean> => {
  const supabase = createClient();

  const { count, error } = await supabase
    .from('players')
    .select('*', { count: 'exact', head: true })
    .eq('first_name', first_name)
    .eq('last_name', last_name);

  if (error) {
    handleError(error, 'fetching player exist');
    return true;
  }

  return count ? count > 0 : false;
};

//========
// UTILITY
//========

export const appendPlayerDetails = (
  platformList: GamePlatform[],
  teamList: Team[],
  player: Player
) => {
  return {
    ...player,
    platform: platformList.find((platform) => platform.id === player.platform_id) || null,
    team: teamList.find((team) => team.id === player.team_id) || null
  };
};

//========
// UPDATE
//========

export const updatePlayerById = async (
  id: string,
  updates: PlayerFormType
): Promise<Player | null> => {
  const supabase = createClient();
  let processedPlayer = {
    first_name: updates.first_name,
    last_name: updates.last_name,
    ingame_name: updates.ingame_name,
    team_id: updates.team.id,
    platform_id: updates.game_platform.id,
    roles: updates.roles,
    picture_url: '',
    is_active: updates.is_active
  };

  if (updates.picture) {
    const filePath = 'images/icons/players';
    const fileName = `${updates.ingame_name}_${Date.now()}.${updates.picture.type.split('/')[1]}`;
    const signedLogoUrl = await uploadFile(filePath, fileName, updates.picture, true);

    if (signedLogoUrl) {
      processedPlayer.picture_url = signedLogoUrl;
    }
  }

  const { data, error } = await supabase
    .from('players')
    .update(processedPlayer)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    handleError(error, `updating player`);
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
      handleError(error, `deleting logo url from player`);
    }
  }

  if (error) {
    handleError(error, `deleting player`);
    return false;
  }

  return true;
};
