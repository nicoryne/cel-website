import { createClient } from '@/lib/supabase/client';
import { ValorantMap, ValorantMapFormType } from '@/lib/types';
import { handleError } from '@/services/utils/errorHandler';
import { deleteFile, uploadFile } from '@/services/utils/storage';

//====================
// Maps API
//====================

//========
// CREATE
//========

export const createMap = async (map: ValorantMapFormType): Promise<ValorantMap | null> => {
  const supabase = createClient();
  let processedMap = {
    name: map.name,
    is_active: map.is_active,
    splash_image_url: ''
  };

  if (map.splash_image) {
    const filePath = 'images/splash/valorant_maps';
    const fileName = `${map.name}_${Date.now()}.${map.splash_image.type.split('/')[1]}`;
    const signedImageUrl = await uploadFile(filePath, fileName, map.splash_image, true);

    if (signedImageUrl) {
      processedMap.splash_image_url = signedImageUrl;
    }
  }

  const { data, error } = await supabase
    .from('valorant_maps')
    .insert([processedMap])
    .select()
    .single();

  if (error) {
    handleError(error, 'creating valorant map');
    return null;
  }

  return data as ValorantMap;
};

//========
// READ
//========

export const getMapCount = async (): Promise<number | null> => {
  const supabase = createClient();
  const { count, error } = await supabase
    .from('valorant_maps')
    .select('*', { count: 'exact', head: true });

  if (error) {
    handleError(error, 'fetching maps count');
    return null;
  }

  return count;
};

export const getAllMaps = async (): Promise<ValorantMap[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('valorant_maps')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    handleError(error, 'fetching valorant maps');
    return [];
  }

  return data || [];
};

export const getMapById = async (id: string): Promise<ValorantMap | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('valorant_maps')
    .select('*')
    .eq('id', id)
    .select()
    .single();

  if (error) {
    handleError(error, `fetching map by`);
    return null;
  }

  return data;
};

export const getMapsByIndexRange = async (min: number, max: number): Promise<ValorantMap[]> => {
  const supabase = createClient();

  const { data, error } = await supabase.from('valorant_maps').select('*').range(min, max);

  if (error) {
    handleError(error, 'fetching valorant map');
    return [];
  }

  return data as ValorantMap[];
};

//========
// UPDATE
//========

export const updateMapById = async (
  id: string,
  updates: ValorantMapFormType
): Promise<ValorantMap | null> => {
  const supabase = createClient();
  let processedMap = {
    name: updates.name,
    is_active: updates.is_active,
    splash_image_url: ''
  };

  if (updates.splash_image) {
    const filePath = 'images/splash/valorant_maps';
    const fileName = `${updates.name}_${Date.now()}.${updates.splash_image.type.split('/')[1]}`;
    const signedImageUrl = await uploadFile(filePath, fileName, updates.splash_image, true);

    if (signedImageUrl) {
      processedMap.splash_image_url = signedImageUrl;
    }
  }

  const { data, error } = await supabase
    .from('valorant_maps')
    .update(processedMap)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    handleError(error, `updating map`);
    return null;
  }

  return data as ValorantMap;
};

//========
// DELETE
//========

export const deleteMapById = async (id: string): Promise<boolean> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('valorant_maps')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (data.splash_image_url) {
    const url = new URL(data.splash_image_url);
    const fileName = url.pathname.replace('/storage/v1/object/sign/images/', '');
    try {
      await deleteFile('images', [fileName]);
    } catch (error) {
      handleError(error, `deleting splash image from map`);
    }
  }

  if (error) {
    handleError(error, `deleting map`);
    return false;
  }

  return true;
};
