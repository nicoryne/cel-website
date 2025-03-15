import { createClient } from '@/lib/supabase/client';
import { handleError } from '@/services/utils/errorHandler';

export const getSignedUrl = async (filePath: string, fileName: string): Promise<string | null> => {
  const supabase = createClient();
  const signedURLTime = 60 * 60 * 24 * 365;
  const { data, error } = await supabase.storage
    .from(filePath)
    .createSignedUrl(fileName, signedURLTime);

  if (error) {
    handleError(error, 'creating signed url');
    return null;
  }

  return data.signedUrl;
};
export const uploadFile = async (
  filePath: string,
  fileName: string,
  file: File,
  createSigned: Boolean
): Promise<string | null> => {
  const supabase = createClient();

  const { error } = await supabase.storage.from(filePath).upload(fileName, file);

  if (error) {
    handleError(error, 'uploading file');
    return null;
  }

  if (createSigned) {
    return await getSignedUrl(filePath, fileName);
  }

  return filePath;
};

export const deleteFile = async (bucketId: string, filePaths: string[]): Promise<Boolean> => {
  const supabase = createClient();

  const { error } = await supabase.storage.from(bucketId).remove(filePaths);

  if (error) {
    handleError(error, 'deleting file');
    return false;
  }

  return true;
};

export const fetchImage = async (url: string, imageName: string, fileType: string) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const blob = await response.blob();
      const imageFile = new File([blob], imageName + `.${fileType}`, {
        type: `image/${fileType}`
      });

      return imageFile;
    } else {
      console.error('Failed to fetch image');
    }
  } catch (error) {
    handleError(error, 'downloading image');
  }
};
