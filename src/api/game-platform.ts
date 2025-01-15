import { createClient } from '@/lib/supabase/client';
import { GamePlatform, GamePlatformFormType } from '@/lib/types';
import { handleError } from '@/api/utils/errorHandler';
import { deleteFile, uploadFile } from '@/api/utils/storage';

//====================
// Game Platforms API
//====================

//========
// CREATE
//========

export const createGamePlatform = async (platform: GamePlatformFormType): Promise<GamePlatform | null> => {
  const supabase = createClient();
  let processedPlatform = {
    platform_title: platform.platform_title,
    platform_abbrev: platform.platform_abbrev,
    logo_url: ''
  };

  if (platform.logo) {
    const filePath = 'images/icons/platforms';
    const fileName = `${platform.platform_abbrev}_${Date.now()}.${platform.logo.type.split('/')[1]}`;
    const signedLogoUrl = await uploadFile(filePath, fileName, platform.logo, true);

    if (signedLogoUrl) {
      processedPlatform.logo_url = signedLogoUrl;
    }
  }

  const { data, error } = await supabase.from('game_platforms').insert([processedPlatform]).select().single();

  if (error) {
    handleError(error, 'creating game platform');
    return null;
  }

  return data as GamePlatform;
};

//========
// READ
//========

export const getGamePlatformCount = async (): Promise<number | null> => {
  const supabase = createClient();
  const { count, error } = await supabase.from('game_platforms').select('*', { count: 'exact', head: true });

  if (error) {
    handleError(error, 'fetching game platform count');
    return null;
  }

  return count;
};

export const getAllGamePlatforms = async (): Promise<GamePlatform[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('game_platforms').select('*');

  if (error) {
    handleError(error, 'fetching game platforms');
    return [];
  }

  return data || [];
};

export const getGamePlatformById = async (id: string): Promise<GamePlatform | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('game_platforms').select('*').eq('id', id).select().single();

  if (error) {
    handleError(error, `fetching game platform by ID: ${id}`);
    return null;
  }

  return data;
};

export const getGamePlatformsByIndexRange = async (min: number, max: number): Promise<GamePlatform[]> => {
  const supabase = createClient();

  const { data, error } = await supabase.from('game_platforms').select('*').range(min, max);

  if (error) {
    handleError(error, 'fetching game platforms by index range');
    return [];
  }

  return data as GamePlatform[];
};

//========
// UPDATE
//========

export const updateGamePlatform = async (id: string, updates: GamePlatformFormType): Promise<GamePlatform | null> => {
  const supabase = createClient();
  let processedPlatform = {
    platform_title: updates.platform_title,
    platform_abbrev: updates.platform_abbrev,
    logo_url: ''
  };

  if (updates.logo) {
    const filePath = 'images/icons/platforms';
    const fileName = `${updates.platform_abbrev}_${Date.now()}.${updates.logo.type.split('/')[1]}`;
    const signedLogoUrl = await uploadFile(filePath, fileName, updates.logo, true);

    if (signedLogoUrl) {
      processedPlatform.logo_url = signedLogoUrl;
    }
  }

  const { data, error } = await supabase
    .from('game_platforms')
    .update(processedPlatform)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    handleError(error, `updating game platform by ID: ${id}`);
    return null;
  }

  return data;
};

//========
// DELETE
//========

export const deleteGamePlatform = async (id: string): Promise<boolean> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('game_platforms').delete().eq('id', id).select().single();

  if (data.logo_url) {
    const url = new URL(data.logo_url);
    const fileName = url.pathname.replace('/storage/v1/object/sign/images/', '');
    try {
      await deleteFile('images', [fileName]);
    } catch (error) {
      handleError(error, `deleting logo url from game platform: ${id}`);
    }
  }

  if (error) {
    handleError(error, `deleting game platform by ID: ${id}`);
    return false;
  }

  return true;
};
