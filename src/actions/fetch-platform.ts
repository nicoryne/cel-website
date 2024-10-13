'use server';
import { createClient } from '@/lib/supabase/client';
import { GamePlatform } from '@/lib/types';

export const getAllGamePlatforms = async (): Promise<GamePlatform[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('game_platforms').select('*');

  if (error) {
    console.error('🔴 Error fetching game platforms', error.message);
    return [];
  }

  return data || [];
};

export const getGamePlatformById = async (id: string): Promise<GamePlatform> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('game_platforms')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('🔴 Error fetching game platform by ID:', error.message);
  }

  return data;
};