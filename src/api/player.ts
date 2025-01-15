import { createClient } from '@/lib/supabase/client';
import { Player, PlayerFormType } from '@/lib/types';
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
    school_name: player.school_name,
    school_abbrev: player.school_abbrev,
    logo_url: ''
  };

  if (player.logo) {
    const filePath = 'images/icons/players';
    const fileName = `${player.school_abbrev}_${Date.now()}.${player.logo.type.split('/')[1]}`;
    const signedLogoUrl = await uploadFile(filePath, fileName, player.logo, true);

    if (signedLogoUrl) {
      processedPlayer.logo_url = signedLogoUrl;
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
// UPDATE
//========

export const updatePlayer = async (id: string, updates: PlayerFormType): Promise<Player | null> => {
  const supabase = createClient();
  let processedPlayer = {
    school_name: updates.school_name,
    school_abbrev: updates.school_abbrev,
    logo_url: ''
  };

  if (updates.logo) {
    const filePath = 'images/icons/players';
    const fileName = `${updates.school_abbrev}_${Date.now()}.${updates.logo.type.split('/')[1]}`;
    const signedLogoUrl = await uploadFile(filePath, fileName, updates.logo, true);

    if (signedLogoUrl) {
      processedPlayer.logo_url = signedLogoUrl;
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
