import { createClient } from '@/lib/supabase/client';
import { Partner, PartnerFormType } from '@/lib/types';
import { handleError } from '@/services/utils/errorHandler';
import { deleteFile, uploadFile } from '@/services/utils/storage';

//====================
// Partner API
//====================

//========
// CREATE
//========

export const createPartner = async (partner: PartnerFormType): Promise<Partner | null> => {
  const supabase = createClient();
  let processedPartner = {
    name: partner.name,
    href: partner.href,
    logo_url: ''
  };

  if (partner.logo) {
    const filePath = 'images/icons/partners';
    const fileName = `${partner.name}_${Date.now()}.${partner.logo.type.split('/')[1]}`;
    const signedLogoUrl = await uploadFile(filePath, fileName, partner.logo, true);

    if (signedLogoUrl) {
      processedPartner.logo_url = signedLogoUrl;
    }
  }

  const { data, error } = await supabase
    .from('partners')
    .insert([processedPartner])
    .select()
    .single();

  if (error) {
    handleError(error, 'creating partner');
    return null;
  }

  return data as Partner;
};

//========
// READ
//========

export const getPartnerCount = async (): Promise<number | null> => {
  const supabase = createClient();
  const { count, error } = await supabase
    .from('partners')
    .select('*', { count: 'exact', head: true });

  if (error) {
    handleError(error, 'fetching partner count');
    return null;
  }

  return count;
};

export const getAllPartners = async (): Promise<Partner[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('name', { ascending: false });

  if (error) {
    handleError(error, 'fetching partners');
    return [];
  }

  return data || [];
};

export const getPartnerById = async (id: string): Promise<Partner | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('id', id)
    .select()
    .single();

  if (error) {
    handleError(error, `fetching partner`);
    return null;
  }

  return data;
};

export const getPartnersByIndexRange = async (min: number, max: number): Promise<Partner[]> => {
  const supabase = createClient();

  const { data, error } = await supabase.from('partners').select('*').range(min, max);

  if (error) {
    handleError(error, 'fetching partners');
    return [];
  }

  return data as Partner[];
};

//========
// UPDATE
//========

export const updatePartnerById = async (
  id: string,
  updates: PartnerFormType
): Promise<Partner | null> => {
  const supabase = createClient();
  let processedPartner = {
    name: updates.name,
    href: updates.href,
    logo_url: ''
  };

  if (updates.logo) {
    const filePath = 'images/icons/partners';
    const fileName = `${updates.name}_${Date.now()}.${updates.logo.type.split('/')[1]}`;
    const signedLogoUrl = await uploadFile(filePath, fileName, updates.logo, true);

    if (signedLogoUrl) {
      processedPartner.logo_url = signedLogoUrl;
    }
  }

  const { data, error } = await supabase
    .from('partners')
    .update(processedPartner)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    handleError(error, `updating partner`);
    return null;
  }

  return data;
};

//========
// DELETE
//========

export const deletePartnerById = async (id: string): Promise<boolean> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('partners').delete().eq('id', id).select().single();

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
    handleError(error, `deleting partner`);
    return false;
  }

  return true;
};
