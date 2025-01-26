import { createClient } from '@/lib/supabase/client';
import { Character, CharacterWithDetails, GamePlatform } from '@/lib/types';
import { handleError } from '@/api/utils/errorHandler';
import { getGamePlatformById } from '@/api/game-platform';

//==================
// Character API
//==================

//========
// CREATE
//========

export const createCharacter = async (character: {}): Promise<Character | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('game_characters').insert([character]).select().single();

  if (error) {
    handleError(error, 'creating character');
    return null;
  }

  return data as Character;
};

//========
// READ
//========

export const getAllCharacters = async (): Promise<Character[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('game_characters')
    .select('*')
    .order('platform_id', { ascending: false })
    .order('name', { ascending: false });

  if (error) {
    handleError(error, 'fetching all characters');
    return [];
  }

  return data || [];
};

export const getCharactersCount = async (): Promise<number | null> => {
  const supabase = createClient();
  const { count, error } = await supabase.from('game_characters').select('*', { count: 'exact', head: true });

  if (error) {
    handleError(error, 'fetching character count');
    return null;
  }

  return count;
};

export const getCharactersByIndexRange = async (min: number, max: number): Promise<Character[]> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('game_characters')
    .select('*')
    .order('platform_id', { ascending: true })
    .order('name', { ascending: true })
    .range(min, max);

  if (error) {
    handleError(error, 'fetching characters by index range');
    return [];
  }

  return data as Character[];
};

export const getCharacterById = async (id: string): Promise<Character | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('game_characters').select('*').eq('id', id).single();

  if (error) {
    handleError(error, `fetching character by ID: ${id}`);
    return null;
  }

  return data;
};

export const getCharacterByName = async (name: string): Promise<Character | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('game_characters').select('*').textSearch('name', name).single();

  if (error) {
    handleError(error, `fetching character by name: ${name}`);
    return null;
  }

  return data as Character;
};

export const getCharactersByGamePlatform = async (platform_id: string): Promise<Character[] | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('game_characters').select('*').eq('platform_id', platform_id);

  if (error) {
    handleError(error, 'fetching characters by platform ID');
    return [];
  }

  return data as Character[];
};

export const getAllCharactersWithDetails = async (): Promise<CharacterWithDetails[]> => {
  const charactersList = await getAllCharacters();
  const charactersListWithDetails: CharacterWithDetails[] = [];

  await Promise.all(
    charactersList.map(async (character) => {
      const gamePlatform = await getGamePlatformById(character.platform_id);

      charactersListWithDetails.push({
        ...character,
        platform: gamePlatform || null
      });
    })
  );

  return charactersListWithDetails;
};

//========
// UTILITY
//========

export const appendCharacterDetails = (platformList: GamePlatform[], character: Character) => {
  return {
    ...character,
    platform: platformList.find((platform) => platform.id === character.platform_id) || null
  };
};

//========
// UPDATE
//========

export const updateCharacterById = async (id: string, updates: Partial<Character>): Promise<Character | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('game_characters').update(updates).eq('id', id).select().single();

  if (error) {
    handleError(error, `updating character by ID: ${id}`);
    return null;
  }

  return data;
};

//========
// DELETE
//========

export const deleteCharacterById = async (id: string): Promise<boolean> => {
  const supabase = createClient();
  const { error } = await supabase.from('game_characters').delete().eq('id', id);

  if (error) {
    handleError(error, `deleting character by ID: ${id}`);
    return false;
  }

  return true;
};
