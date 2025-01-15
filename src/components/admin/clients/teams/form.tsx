'use client';
import React from 'react';
import Image from 'next/image';
import { Team, TeamFormType } from '@/lib/types';
import not_found from '@/../../public/images/not-found.webp';

type CharacterFormProps = {
  formData: React.MutableRefObject<TeamFormType | undefined>;
  team: Team | null;
};

export default function TeamsForm({ formData, team }: CharacterFormProps) {
  const [teamInfo, setTeamInfo] = React.useState<TeamFormType>({
    school_name: team?.school_name || '',
    school_abbrev: team?.school_abbrev || '',
    logo: null
  });

  const [selectedImagePreview, setSelectedImagePreview] = React.useState('');

  const updateTeamInfo = (field: keyof TeamFormType, value: File | string) => {
    setTeamInfo((teamInfo) => ({
      ...teamInfo,
      [field]: value
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files[0]) {
      updateTeamInfo('logo', files[0]);

      const imageURL = URL.createObjectURL(files[0]);
      setSelectedImagePreview(imageURL);
    }
  };

  const fetchImage = async (team: Team, imageName: string, fileType: string) => {
    try {
      const response = await fetch(team.logo_url);
      if (response.ok) {
        const blob = await response.blob();
        const imageFile = new File([blob], imageName + `.${fileType}`, {
          type: `image/${fileType}`
        });
        updateTeamInfo('logo', imageFile);
        setSelectedImagePreview(team.logo_url);
      } else {
        console.error('Failed to fetch image');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  React.useEffect(() => {
    if (team?.logo_url) {
      fetchImage(team, `${team.school_abbrev}`, 'webp');
    }
  }, [team?.logo_url]);

  // Insert New Team
  React.useEffect(() => {
    formData.current = teamInfo;
  }, [teamInfo, formData]);

  return (
    <form className="my-4 rounded-md border-2 border-neutral-700 bg-neutral-900 p-4">
      <div className="flex flex-col gap-4">
        {/* Title */}
        <div>
          <label htmlFor="name" className="text-xs">
            School Name
          </label>
          <div>
            <input
              type="text"
              name="name"
              id="name"
              className="h-10 w-full rounded-md border-2 border-neutral-700 bg-neutral-900"
              value={teamInfo.school_name}
              onChange={(e) => updateTeamInfo('school_name', e.target.value)}
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
              value={teamInfo.school_abbrev}
              onChange={(e) => updateTeamInfo('school_abbrev', e.target.value)}
            />
          </div>
        </div>

        {/* Team Image */}
        <div>
          <span className="mb-2 block text-xs">Team Image</span>
          <div className="flex items-center gap-4">
            {/* Custom File Upload Button */}
            <label htmlFor="file-upload" className="cursor-pointer hover:opacity-40">
              {selectedImagePreview ? (
                <Image src={selectedImagePreview} alt={`${team?.school_abbrev} Picture`} height={60} width={60} />
              ) : (
                <Image src={not_found} alt={`No Image Logo`} height={60} width={60} />
              )}
            </label>
            <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            {/* Display Selected File Name */}
            <span className="text-sm text-neutral-400">{teamInfo.logo ? teamInfo.logo.name : 'No file chosen'}</span>
          </div>
        </div>
      </div>
    </form>
  );
}
