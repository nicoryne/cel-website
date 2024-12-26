'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GamePlatform, Team, PlayerWithDetails, Roles } from '@/lib/types';
import not_found from '@/../../public/images/not-found.webp';

type PlayerFormProps = {
  teamsList: Team[];
  platforms: GamePlatform[];
  formData: React.MutableRefObject<{}>;
  player: PlayerWithDetails | null;
};

export default function PlayerForm({
  teamsList,
  platforms,
  formData,
  player
}: PlayerFormProps) {
  // Remove TBD from teamsList
  teamsList = teamsList.filter((team) => team.school_abbrev !== 'TBD');

  // First Name
  const [firstName, setFirstName] = React.useState(player?.first_name || '');

  // Last Name
  const [lastName, setLastName] = React.useState(player?.last_name || '');

  // Ingame Name
  const [ingameName, setIngameName] = React.useState(player?.ingame_name || '');

  // Team
  const [selectedTeam, setSelectedTeam] = React.useState(
    player?.team || teamsList[0]
  );
  const [teamMenu, toggleTeamMenu] = React.useState(false);

  // Game Platform
  const [selectedPlatform, setSelectedPlatform] = React.useState(
    player?.platform || platforms[0]
  );
  const [platformMenu, togglePlatformMenu] = React.useState(false);

  // Roles
  const [selectedRoles, setSelectedRoles] = React.useState(player?.roles || []);

  const handleRoleChange = (role: string, checked: boolean) => {
    setSelectedRoles(
      (prev) =>
        checked
          ? [...prev, role] // Add role if checked
          : prev.filter((r) => r !== role) // Remove role if unchecked
    );
  };

  const generalRoles = Object.values(Roles.General);

  const platformRoles = Object.values(
    Roles[selectedPlatform.platform_abbrev as keyof typeof Roles] || {}
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
    if (player?.picture_url) {
      const fetchImage = async () => {
        try {
          const response = await fetch(player.picture_url);
          if (response.ok) {
            const blob = await response.blob();
            const imageFile = new File([blob], 'player_image.webp', {
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
  }, [player?.picture_url]);

  // Insert New Series
  React.useEffect(() => {
    let newFormData = {
      first_name: firstName,
      last_name: lastName,
      ingame_name: ingameName,
      team_id: selectedTeam.id,
      game_platform_id: selectedPlatform.id,
      roles: selectedRoles,
      picture: selectedImage
    };

    formData.current = newFormData;
  });

  return (
    <form className="my-4 rounded-md border-2 border-neutral-700 bg-neutral-900 p-4">
      <div className="flex flex-col gap-4">
        {/* First Name & Last Name */}
        <div className="flex justify-between gap-4">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="text-xs">
              First Name
            </label>
            <div>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="h-10 w-full rounded-md border-2 border-neutral-700 bg-neutral-900"
                value={firstName || ''}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>
          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="text-xs">
              Last Name
            </label>
            <div>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="h-10 w-full rounded-md border-2 border-neutral-700 bg-neutral-900"
                value={lastName || ''}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* Ingame Name */}
        <div>
          <span className="text-xs">Ingame Name</span>
          <div>
            <input
              className="h-10 w-full rounded-md border-2 border-neutral-700 bg-neutral-900"
              value={ingameName || ''}
              onChange={(e) => setIngameName(e.target.value)}
            />
          </div>
        </div>
        {/* Team */}
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="team" className="text-xs">
            Team
          </label>
          <div className="flex flex-col items-end space-y-12">
            {/* Button to select Team */}
            <button
              type="button"
              id="team"
              name="team"
              className="flex h-10 w-full items-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 px-4 text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800"
              onClick={() => toggleTeamMenu(!teamMenu)}
            >
              <Image
                src={selectedTeam.logo_url || '/placeholder.png'}
                className="h-auto w-4"
                width={128}
                height={128}
                alt={`${selectedTeam.school_abbrev || 'Team'} Logo`}
              />
              <p className="text-xs md:text-base">
                {selectedTeam.school_abbrev || 'Select Team'}
              </p>
            </button>

            {/* Dropdown for TeamSelection */}
            {teamMenu && (
              <motion.div
                className="absolute flex w-96 flex-col place-self-center rounded-md border-2 border-neutral-600 shadow-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {teamsList.map((team, index) => (
                  <button
                    className={`justify-left flex h-10 w-full place-items-center gap-2 px-4 text-neutral-300 hover:text-white ${
                      team.id === selectedTeam.id
                        ? 'bg-neutral-800'
                        : 'bg-[var(--background)]'
                    }`}
                    key={index}
                    onClick={() => {
                      setSelectedTeam(team);
                      toggleTeamMenu(!teamMenu);
                    }}
                  >
                    <Image
                      src={team.logo_url}
                      className="h-auto w-4"
                      width={128}
                      height={128}
                      alt={`${team.school_abbrev} Logo`}
                    />
                    <p className="text-xs">{team.school_abbrev}</p>
                  </button>
                ))}
              </motion.div>
            )}
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

        {/* Roles */}
        {/* Roles Section */}
        <div>
          <label className="text-xs">Roles</label>
          <div className="mt-2 grid grid-cols-3">
            {generalRoles.map((role) => (
              <div key={role} className="flex items-center">
                <input
                  type="checkbox"
                  id={`general-${role}`}
                  checked={selectedRoles.includes(role)}
                  onChange={(e) => handleRoleChange(role, e.target.checked)}
                />
                <label htmlFor={`general-${role}`} className="ml-2 text-sm">
                  {role}
                </label>
              </div>
            ))}
            {platformRoles.map((role) => (
              <div key={role} className="flex items-center">
                <input
                  type="checkbox"
                  id={`platform-${role}`}
                  checked={selectedRoles.includes(role)}
                  onChange={(e) => handleRoleChange(role, e.target.checked)}
                />
                <label htmlFor={`platform-${role}`} className="ml-2 text-sm">
                  {role}
                </label>
              </div>
            ))}
          </div>
        </div>
        {/* Player Image */}
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
                  alt={`${player?.ingame_name} Picture`}
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
