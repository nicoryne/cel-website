'use client';
import React from 'react';
import Image from 'next/image';
import { GamePlatform, LeagueSchedule, PlayerFormType, PlayerWithDetails, Team } from '@/lib/types';
import not_found from '@/../../public/images/not-found.webp';
import { fetchImage } from '@/services/utils/storage';
import { motion } from 'framer-motion';
import { Roles } from '@/lib/enums';

type PlayerFormProps = {
  formData: React.MutableRefObject<PlayerFormType | undefined>;
  player: PlayerWithDetails | null;
  platformList: GamePlatform[];
  teamList: Team[];
  leagueSchedules: Record<string, LeagueSchedule[]>;
};

export default function PlayerForm({
  formData,
  player,
  platformList,
  teamList,
  leagueSchedules
}: PlayerFormProps) {
  const [playerInfo, setPlayerInfo] = React.useState<PlayerFormType>({
    first_name: player?.first_name || '',
    last_name: player?.last_name || '',
    ingame_name: player?.ingame_name || '',
    team: player?.team || teamList[0],
    game_platform: player?.platform || platformList[0],
    roles: player?.roles || [],
    picture: null,
    is_active: player?.is_active ?? true,
    league_schedules: player?.league_schedules?.map((schedule) => schedule.league_schedule_id) || []
  });

  const [selectedImagePreview, setSelectedImagePreview] = React.useState('');
  const [teamMenu, toggleTeamMenu] = React.useState(false);
  const [platformMenu, togglePlatformMenu] = React.useState(false);

  const generalRoles = Object.values(Roles.General);
  const platformRoles = Object.values(
    Roles[playerInfo.game_platform.platform_abbrev as keyof typeof Roles] || {}
  );

  const handleRoleChange = (role: string, checked: boolean) => {
    const updatedRoles = checked
      ? [...playerInfo.roles, role]
      : playerInfo.roles.filter((r) => r !== role);
    updatePlayerInfo('roles', updatedRoles);
  };

  const updatePlayerInfo = React.useCallback((field: keyof PlayerFormType, value: any) => {
    setPlayerInfo((prev) => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files[0]) {
      updatePlayerInfo('picture', files[0]);

      const imageURL = URL.createObjectURL(files[0]);
      setSelectedImagePreview(imageURL);
    }
  };

  const setPlayerImage = async (url: string, ign: string) => {
    const imageFile = await fetchImage(url, ign, 'webp');

    if (imageFile) {
      updatePlayerInfo('picture', imageFile);
    }
  };

  React.useEffect(() => {
    if (player?.picture_url) {
      setPlayerImage(player.picture_url, player.ingame_name);
      setSelectedImagePreview(player.picture_url);
    }
  }, [player]);

  // Insert New Platform
  React.useEffect(() => {
    formData.current = playerInfo;
  }, [playerInfo, formData]);

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
                value={playerInfo.first_name || ''}
                onChange={(e) => updatePlayerInfo('first_name', e.target.value)}
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
                value={playerInfo.last_name || ''}
                onChange={(e) => updatePlayerInfo('last_name', e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* Ingame Name */}
        <div>
          <label htmlFor="ingameName" className="text-xs">
            Ingame Name
          </label>
          <div>
            <input
              type="text"
              id="ingameName"
              name="ingameName"
              className="h-10 w-full rounded-md border-2 border-neutral-700 bg-neutral-900"
              value={playerInfo.ingame_name || ''}
              onChange={(e) => updatePlayerInfo('ingame_name', e.target.value)}
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
                src={playerInfo.team?.logo_url}
                className="h-auto w-4"
                width={128}
                height={128}
                alt={`${playerInfo.team?.school_abbrev || 'Team'} Logo`}
              />
              <p className="text-xs md:text-base">
                {playerInfo.team?.school_abbrev || 'Select Team'}
              </p>
            </button>

            {/* Dropdown for TeamSelection */}
            {teamMenu && (
              <motion.div
                className="absolute flex w-96 flex-col place-self-center rounded-md border-2 border-neutral-600 shadow-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {teamList.map((team, index) => (
                  <button
                    className={`justify-left flex h-10 w-full place-items-center gap-2 px-4 text-neutral-300 hover:text-white ${
                      team.id === playerInfo.team.id ? 'bg-neutral-800' : 'bg-[var(--background)]'
                    }`}
                    key={index}
                    onClick={() => {
                      updatePlayerInfo('team', team);
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
                src={playerInfo.game_platform?.logo_url}
                className="h-auto w-4"
                width={128}
                height={128}
                alt={`${playerInfo.game_platform?.platform_abbrev || 'Platform'} Logo`}
              />
              <p className="text-xs md:text-base">
                {playerInfo.game_platform?.platform_title || 'Select Platform'}
              </p>
            </button>

            {/* Dropdown for Game Platform Selection */}
            {platformMenu && (
              <motion.div
                className="absolute flex w-96 flex-col place-self-center rounded-md border-2 border-neutral-600 shadow-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {platformList.map((platform, index) => (
                  <button
                    className={`justify-left flex h-10 w-full place-items-center gap-2 px-4 text-neutral-300 hover:text-white ${
                      platform.id === playerInfo.game_platform?.id
                        ? 'bg-neutral-800'
                        : 'bg-[var(--background)]'
                    }`}
                    key={index}
                    onClick={() => {
                      updatePlayerInfo('game_platform', platform);
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
        <div>
          <label className="text-xs">League Schedules</label>
          <div className="mt-2 flex gap-8">
            {Object.entries(leagueSchedules).map(([season, schedules]) => {
              const scheduleIds = schedules.map((s) => s.id);
              return (
                <div key={season} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={season}
                    checked={scheduleIds.every((id) => playerInfo.league_schedules.includes(id))}
                    onChange={(e) => {
                      const selectedSchedules = e.target.checked
                        ? [...playerInfo.league_schedules, ...scheduleIds]
                        : playerInfo.league_schedules.filter((id) => !scheduleIds.includes(id));

                      updatePlayerInfo('league_schedules', selectedSchedules);
                    }}
                  />
                  <label htmlFor={season}>{season}</label>
                </div>
              );
            })}
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
                  checked={playerInfo.roles.includes(role)}
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
                  checked={playerInfo.roles.includes(role)}
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
            <label htmlFor="file-upload" className="cursor-pointer hover:opacity-90">
              {selectedImagePreview ? (
                <Image
                  src={selectedImagePreview}
                  alt={`${player?.ingame_name} Picture`}
                  height={60}
                  width={60}
                />
              ) : (
                <Image src={not_found} alt={`No Image Logo`} height={60} width={60} />
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
              {playerInfo.picture ? playerInfo.picture.name : 'No file chosen'}
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}
