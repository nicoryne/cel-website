'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Team } from '@/lib/types';
import not_found from '@/../../public/images/not-found.webp';

type TeamsFormProps = {
  team: Team | null;
  formData: React.MutableRefObject<{}>;
};

export default function TeamsForm({ team, formData }: TeamsFormProps) {
  // Team
  const [teamAbbrev, setTeamAbbrev] = React.useState(team?.school_abbrev || '');
  const [teamFullTitle, setTeamFullTitle] = React.useState(
    team?.school_name || ''
  );

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
    if (team?.logo_url) {
      const fetchImage = async () => {
        try {
          const response = await fetch(team.logo_url);
          if (response.ok) {
            const blob = await response.blob();
            const imageFile = new File([blob], `${team.school_abbrev}.webp`, {
              type: 'image/webp'
            });
            setSelectedImage(imageFile);
            setSelectedImagePreview(URL.createObjectURL(imageFile));
          } else {
            console.error('Failed to fetch image');
          }
        } catch (error) {
          console.error('Error downloading image:', error);
        }
      };
      fetchImage();
    }
  }, [team?.logo_url]);

  // Insert New Team
  React.useEffect(() => {
    let newFormData = {
      school_abbrev: teamAbbrev,
      school_name: teamFullTitle,
      picture: selectedImage
    };

    formData.current = newFormData;
  });

  return (
    <form className="my-4 rounded-md border-2 border-neutral-700 bg-neutral-900 p-4">
      <div className="flex flex-col gap-4">
        {/* Full Title */}
        <div>
          <span className="text-xs">Full Title</span>
          <div>
            <input
              type="text"
              className="h-10 w-full rounded-md border-2 border-neutral-700 bg-neutral-900"
              value={teamFullTitle || ''}
              onChange={(e) => setTeamFullTitle(e.target.value)}
            />
          </div>
        </div>
        {/* Ingame Name */}
        <div>
          <span className="text-xs">Ingame Name</span>
          <div>
            <input
              type="text"
              className="h-10 w-full rounded-md border-2 border-neutral-700 bg-neutral-900"
              value={teamAbbrev || ''}
              onChange={(e) => setTeamAbbrev(e.target.value)}
            />
          </div>
        </div>

        {/* Team Image */}
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
                  alt={`${team?.school_abbrev} Logo`}
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
