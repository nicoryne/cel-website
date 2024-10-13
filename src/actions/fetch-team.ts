'use server';
import { createClient } from '@/lib/supabase/client';
import { Team } from '@/lib/types';

export const getAllTeams = async (): Promise<Team[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('team').select('*');

  if (error) {
    console.error('🔴 Error fetching teams', error.message);
    return [];
  }

  return data || [];
};

export const getTeamById = async (id: string): Promise<Team> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('🔴 Error fetching team by ID:', error.message);
  }

  return data;
};
