'use client';
import React from 'react';
import Image from 'next/image';
import { PlayerFormType, PlayerWithDetails } from '@/lib/types';
import not_found from '@/../../public/images/not-found.webp';

type PlayerFormProps = {
  formData: React.MutableRefObject<PlayerFormType | undefined>;
  player: PlayerWithDetails | null;
};

export default function PlayerForm({ formData, player }: PlayerFormProps) {
  const [playerInfo, setPlayerInfo] = React.useState<PlayerFormType>({
    first_name: player?.first_name || '',
    last_name: player?.last_name || '',
    ingame_name: player?.ingame_name || '',
    team_id: player?.team?.id || '',
    game_platform_id: player?.platform?.id || '',
    roles: player?.roles || [],
    picture: null
  });

  const updatePlayerInfo = (field: keyof PlayerFormType, value: File | string) => {
    setPlayerInfo((platformInfo) => ({
      ...platformInfo,
      [field]: value
    }));
  };

  const [selectedImagePreview, setSelectedImagePreview] = React.useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files[0]) {
      updatePlayerInfo('picture', files[0]);

      const imageURL = URL.createObjectURL(files[0]);
      setSelectedImagePreview(imageURL);
    }
  };

  React.useEffect(() => {
    if (player?.picture_url) {
      const imageFile = fetchImage(player?.picture_url, `${player.ingame_name}`, 'webp');

      updatePlayerInfo('picture', imageFile);
      setSelectedImagePreview();
    }
  }, [player?.picture_url]);

  // Insert New Platform
  React.useEffect(() => {
    formData.current = playerInfo;
  }, [playerInfo, formData]);

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
