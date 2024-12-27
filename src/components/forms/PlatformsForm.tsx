'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GamePlatform } from '@/lib/types';
import not_found from '@/../../public/images/not-found.webp';

type CharacterFormProps = {
  formData: React.MutableRefObject<{}>;
  platform: GamePlatform | null;
};

export default function PlatformsForm({
  formData,
  platform
}: CharacterFormProps) {
  // Full Title
  const [title, setTitle] = React.useState(platform?.platform_title || '');

  // Abbreviation
  const [abbrev, setAbbrev] = React.useState(platform?.platform_abbrev || '');

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
    if (platform?.logo_url) {
      const fetchImage = async () => {
        try {
          const response = await fetch(platform.logo_url);
          if (response.ok) {
            const blob = await response.blob();
            const imageFile = new File([blob], 'platform_image.webp', {
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
  }, [platform?.logo_url]);

  // Insert New Platform
  React.useEffect(() => {
    let newFormData = {
      platform_title: title,
      platform_abbrev: abbrev,
      logo: selectedImage
    };

    formData.current = newFormData;
  });

  return (
    <form className="my-4 rounded-md border-2 border-neutral-700 bg-neutral-900 p-4">
      <div className="flex flex-col gap-4">
        {/* Title */}
        <div>
          <span className="text-xs">Title</span>
          <div>
            <input
              type="text"
              className="h-10 w-full rounded-md border-2 border-neutral-700 bg-neutral-900"
              value={title || ''}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        {/* Abbreviation */}
        <div>
          <span className="text-xs">Abbreviation</span>
          <div>
            <input
              type="text"
              className="h-10 w-full rounded-md border-2 border-neutral-700 bg-neutral-900"
              value={abbrev || ''}
              onChange={(e) => setAbbrev(e.target.value)}
            />
          </div>
        </div>

        {/* Platform Image */}
        <div>
          <label className="mb-2 block text-xs">Platform Image</label>
          <div className="flex items-center gap-4">
            {/* Custom File Upload Button */}
            <label
              htmlFor="file-upload"
              className="cursor-pointer hover:opacity-90"
            >
              {selectedImagePreview ? (
                <Image
                  src={selectedImagePreview}
                  alt={`${platform?.platform_abbrev} Picture`}
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
