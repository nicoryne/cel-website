'use client';
import React from 'react';
import Image from 'next/image';
import { GamePlatform, GamePlatformFormType } from '@/lib/types';
import not_found from '@/../../public/images/not-found.webp';

type CharacterFormProps = {
  formData: React.MutableRefObject<GamePlatformFormType | undefined>;
  platform: GamePlatform | null;
};

export default function PlatformsForm({ formData, platform }: CharacterFormProps) {
  const [platformInfo, setPlatformInfo] = React.useState<GamePlatformFormType>({
    platform_title: platform?.platform_title || '',
    platform_abbrev: platform?.platform_abbrev || '',
    logo: null
  });

  const updatePlatformInfo = (field: keyof GamePlatformFormType, value: File | string) => {
    setPlatformInfo((platformInfo) => ({
      ...platformInfo,
      [field]: value
    }));
  };

  const [selectedImagePreview, setSelectedImagePreview] = React.useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files[0]) {
      updatePlatformInfo('logo', files[0]);

      const imageURL = URL.createObjectURL(files[0]);
      setSelectedImagePreview(imageURL);
    }
  };

  const fetchImage = async (platform: GamePlatform, imageName: string, fileType: string) => {
    try {
      const response = await fetch(platform.logo_url);
      if (response.ok) {
        const blob = await response.blob();
        const imageFile = new File([blob], imageName + `.${fileType}`, {
          type: `image/${fileType}`
        });
        updatePlatformInfo('logo', imageFile);
        setSelectedImagePreview(platform.logo_url);
      } else {
        console.error('Failed to fetch image');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  React.useEffect(() => {
    if (platform?.logo_url) {
      fetchImage(platform, `${platform.platform_abbrev}`, 'webp');
    }
  }, [platform?.logo_url]);

  // Insert New Platform
  React.useEffect(() => {
    formData.current = platformInfo;
  }, [platformInfo, formData]);

  return (
    <form className="my-4 rounded-md border-2 border-neutral-700 bg-neutral-900 p-4">
      <div className="flex flex-col gap-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="text-xs">
            Title
          </label>
          <div>
            <input
              type="text"
              name="title"
              id="title"
              className="h-10 w-full rounded-md border-2 border-neutral-700 bg-neutral-900"
              value={platformInfo.platform_title}
              onChange={(e) => updatePlatformInfo('platform_title', e.target.value)}
            />
          </div>
        </div>

        {/* Abbreviation */}
        <div>
          <label htmlFor="abbrev" className="text-xs">
            Abbreviation
          </label>
          <div>
            <input
              type="text"
              name="abbrev"
              id="abbrev"
              className="h-10 w-full rounded-md border-2 border-neutral-700 bg-neutral-900"
              value={platformInfo.platform_abbrev}
              onChange={(e) => updatePlatformInfo('platform_abbrev', e.target.value)}
            />
          </div>
        </div>

        {/* Platform Image */}
        <div>
          <span className="mb-2 block text-xs">Platform Image</span>
          <div className="flex items-center gap-4">
            {/* Custom File Upload Button */}
            <label htmlFor="file-upload" className="cursor-pointer hover:opacity-40">
              {selectedImagePreview ? (
                <Image src={selectedImagePreview} alt={`${platform?.platform_abbrev} Picture`} height={60} width={60} />
              ) : (
                <Image src={not_found} alt={`No Image Logo`} height={60} width={60} />
              )}
            </label>
            <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            {/* Display Selected File Name */}
            <span className="text-sm text-neutral-400">
              {platformInfo.logo ? platformInfo.logo.name : 'No file chosen'}
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}
