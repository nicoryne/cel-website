'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GamePlatform, CharacterWithDetails, Team } from '@/lib/types';
import { Roles } from '@/lib/enums';
import not_found from '@/../../public/images/not-found.webp';

type CharacterFormProps = {
  platforms: GamePlatform[];
  formData: React.MutableRefObject<{}>;
  character: CharacterWithDetails | null;
};

export default function CharactersForm({
  platforms,
  formData,
  character
}: CharacterFormProps) {
  // Name
  const [name, setName] = React.useState(character?.name || '');

  // Role
  const [role, setRole] = React.useState(character?.role || '');

  // Game Platform
  const [selectedPlatform, setSelectedPlatform] = React.useState(
    character?.platform || platforms[0]
  );
  const [platformMenu, togglePlatformMenu] = React.useState(false);

  // Picture
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = React.useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files[0]) {
      setSelectedImage(files[0]);

      const imageURL = URL.createObjectURL(files[0]);
      setSelectedImagePreview(imageURL);
    }
  };
  React.useEffect(() => {
    if (character?.logo_url) {
      const fetchImage = async () => {
        try {
          const response = await fetch(character.logo_url);
          if (response.ok) {
            const blob = await response.blob();
            const imageFile = new File([blob], 'character_image.webp', {
              type: 'image/webp'
            });
            setSelectedImage(imageFile);
          } else {
            console.error('Failed to fetch image');
          }
        } catch (error) {
          console.error('Error downloading image:', error);
        }
      };
      fetchImage();
    }
  }, [character?.logo_url]);

  // Insert New Character
  React.useEffect(() => {
    let newFormData = {
      name: name,
      role: role,
      logo: selectedImage,
      platform_id: selectedPlatform.id
    };

    formData.current = newFormData;
  });

  return (
    <form className="my-4 rounded-md border-2 border-neutral-700 bg-neutral-900 p-4">
      <div className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <span className="text-xs">Name</span>
          <div>
            <input
              type="text"
              className="h-10 w-full rounded-md border-2 border-neutral-700 bg-neutral-900"
              value={name || ''}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* Role */}
        <div>
          <span className="text-xs">Role</span>
          <div>
            <input
              type="text"
              className="h-10 w-full rounded-md border-2 border-neutral-700 bg-neutral-900"
              value={role || ''}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
        </div>

        {/* Game Platform */}
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="game" className="text-xs">
            Game
          </label>
          <div className="flex flex-col items-end space-y-12">
            {/* Button to select Game Platform */}
            <button
              type="button"
              name="game"
              id="game"
              className="flex h-10 w-full items-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 px-4 text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800"
              onClick={() => togglePlatformMenu(!platformMenu)}
            >
              <Image
                src={selectedPlatform.logo_url || '/placeholder.png'}
                className="h-auto w-4"
                width={128}
                height={128}
                alt={`${selectedPlatform.platform_abbrev || 'Platform'} Logo`}
              />
              <p className="text-xs md:text-base">
                {selectedPlatform.platform_title || 'Select Platform'}
              </p>
            </button>

            {/* Dropdown for Game Platform Selection */}
            {platformMenu && (
              <motion.div
                className="absolute flex w-96 flex-col place-self-center rounded-md border-2 border-neutral-600 shadow-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {platforms.map((platform, index) => (
                  <button
                    className={`justify-left flex h-10 w-full place-items-center gap-2 px-4 text-neutral-300 hover:text-white ${
                      platform.id === selectedPlatform.id
                        ? 'bg-neutral-800'
                        : 'bg-[var(--background)]'
                    }`}
                    key={index}
                    onClick={() => {
                      setSelectedPlatform(platform);
                      togglePlatformMenu(!platformMenu);
                    }}
                  >
                    <Image
                      src={platform.logo_url}
                      className="h-auto w-4"
                      width={128}
                      height={128}
                      alt={`${platform.platform_abbrev} Logo`}
                    />
                    <p className="text-xs">{platform.platform_title}</p>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Character Image */}
        <div>
          <label className="mb-2 block text-xs">Team Image</label>
          <div className="flex items-center gap-4">
            {/* Custom File Upload Button */}
            <label
              htmlFor="file-upload"
              className="cursor-pointer hover:opacity-90"
            >
              {selectedImagePreview ? (
                <Image
                  src={selectedImagePreview}
                  alt={`${character?.name} Picture`}
                  height={60}
                  width={60}
                />
              ) : (
                <Image
                  src={not_found}
                  alt={`No Image Logo`}
                  height={60}
                  width={60}
                />
              )}
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {/* Display Selected File Name */}
            <span className="text-sm text-neutral-400">
              {selectedImage ? selectedImage.name : 'No file chosen'}
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}
