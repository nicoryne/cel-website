import { createClient } from '@/lib/supabase/client';
import { GamePlatform, GamePlatformFormType, Team, TeamFormType } from '@/lib/types';
import { handleError } from '@/services/utils/errorHandler';
import { deleteFile, uploadFile } from '@/services/utils/storage';

//====================
// Team API
//====================

//========
// CREATE
//========

export const createTeam = async (team: TeamFormType): Promise<Team | null> => {
  const supabase = createClient();
  let processedTeam = {
    school_name: team.school_name,
    school_abbrev: team.school_abbrev,
    logo_url: ''
  };

  if (team.logo) {
    const filePath = 'images/icons/teams';
    const fileName = `${team.school_abbrev}_${Date.now()}.${team.logo.type.split('/')[1]}`;
    const signedLogoUrl = await uploadFile(filePath, fileName, team.logo, true);

    if (signedLogoUrl) {
      processedTeam.logo_url = signedLogoUrl;
    }
  }

  const { data, error } = await supabase.from('teams').insert([processedTeam]).select().single();

  if (error) {
    handleError(error, 'creating team');
    return null;
  }

  return data as Team;
};

//========
// READ
//========

export const getTeamCount = async (): Promise<number | null> => {
  const supabase = createClient();
  const { count, error } = await supabase.from('teams').select('*', { count: 'exact', head: true });

  if (error) {
    handleError(error, 'fetching team count');
    return null;
  }

  return count;
};

export const getAllTeams = async (): Promise<Team[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('teams').select('*');

  if (error) {
    handleError(error, 'fetching teams');
    return [];
  }

  return data || [];
};

export const getTeamById = async (id: string): Promise<Team | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('teams').select('*').eq('id', id).select().single();

  if (error) {
    handleError(error, `fetching team`);
    return null;
  }

  return data;
};

export const getTeamsByIndexRange = async (min: number, max: number): Promise<Team[]> => {
  const supabase = createClient();

  const { data, error } = await supabase.from('teams').select('*').range(min, max);

  if (error) {
    handleError(error, 'fetching team');
    return [];
  }

  return data as Team[];
};

//========
// UPDATE
//========

export const updateTeamById = async (id: string, updates: TeamFormType): Promise<Team | null> => {
  const supabase = createClient();
  let processedTeam = {
    school_name: updates.school_name,
    school_abbrev: updates.school_abbrev,
    team_name: updates.team_name,
    logo_url: ''
  };

  if (updates.logo) {
    const filePath = 'images/icons/teams';
    const fileName = `${updates.school_abbrev}_${Date.now()}.${updates.logo.type.split('/')[1]}`;
    const signedLogoUrl = await uploadFile(filePath, fileName, updates.logo, true);

    if (signedLogoUrl) {
      processedTeam.logo_url = signedLogoUrl;
    }
  }

  const { data, error } = await supabase
    .from('teams')
    .update(processedTeam)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    handleError(error, `updating team`);
    return null;
  }

  return data;
};

//========
// DELETE
//========

export const deleteTeamById = async (id: string): Promise<boolean> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('teams').delete().eq('id', id).select().single();

  if (data.logo_url) {
    const url = new URL(data.logo_url);
    const fileName = url.pathname.replace('/storage/v1/object/sign/images/', '');
    try {
      await deleteFile('images', [fileName]);
    } catch (error) {
      handleError(error, `deleting logo url`);
    }
  }

  if (error) {
    handleError(error, `deleting team`);
    return false;
  }

  return true;
};
