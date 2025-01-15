'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GamePlatform, CharacterWithDetails } from '@/lib/types';
import { Roles } from '@/lib/enums';

type CharacterFormProps = {
  platforms: GamePlatform[];
  formData: React.MutableRefObject<{}>;
  character: CharacterWithDetails | null;
};

export default function CharactersForm({ platforms, formData, character }: CharacterFormProps) {
  const valoRoles = Object.values(Roles.VALO);
  const mlbbRoles = Object.values(Roles.MLBB_HEROES);

  const [name, setName] = React.useState<string>(character?.name || '');
  const [role, setRole] = React.useState<string>(character?.role || '');
  const [roleMenu, setRoleMenu] = React.useState(false);
  const [roleOptions, setRoleOptions] = React.useState<any[]>([]);
  const [selectedPlatform, setSelectedPlatform] = React.useState<GamePlatform>(character?.platform || platforms[0]);
  const [platformMenu, setPlatformMenu] = React.useState(false);

  // Update formData whenever fields change
  React.useEffect(() => {
    formData.current = {
      name,
      role,
      platform_id: selectedPlatform.id
    };
  }, [name, role, selectedPlatform, formData]);

  React.useEffect(() => {
    selectedPlatform.platform_abbrev === 'MLBB' ? setRoleOptions(mlbbRoles) : setRoleOptions(valoRoles);
  }, [selectedPlatform]);

  return (
    <form className="my-4 rounded-md border-2 border-neutral-700 bg-neutral-900 p-4">
      <div className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="text-xs">
            Name
          </label>
          <div>
            <input
              type="text"
              name="name"
              id="name"
              className="h-10 w-full rounded-md border-2 border-neutral-700 bg-neutral-900"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* Role */}
        <div className="relative flex flex-col gap-2">
          <label htmlFor="role" className="text-xs">
            Role
          </label>
          <div className="flex flex-col items-end">
            {/* Button to select Role */}
            <button
              type="button"
              name="role"
              id="role"
              className="flex h-10 w-full items-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 px-4 text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800"
              onClick={(e) => {
                e.preventDefault();
                setRoleMenu(!roleMenu);
              }}
            >
              <p className="text-xs md:text-base">{role || 'Select Role'}</p>
            </button>

            {/* Dropdown for Role Selection */}
            {roleMenu && (
              <motion.div
                className="absolute z-10 mt-12 flex w-full flex-col rounded-md border-2 border-neutral-600 bg-neutral-900 shadow-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {roleOptions.map((roleOption, index) => (
                  <button
                    key={index}
                    className={`flex items-center gap-2 px-4 py-2 text-left text-neutral-300 hover:text-white ${
                      roleOption === role ? 'bg-neutral-800' : 'bg-[var(--background)]'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setRole(roleOption);
                      setRoleMenu(false);
                    }}
                  >
                    <p className="text-xs">{roleOption}</p>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Game Platform */}
        <div className="relative flex flex-col gap-2">
          <label htmlFor="game" className="text-xs">
            Game
          </label>
          <div className="flex flex-col items-end">
            {/* Button to select Game Platform */}
            <button
              type="button"
              name="game"
              id="game"
              className="flex h-10 w-full items-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 px-4 text-white transition-colors duration-150 ease-linear hover:border-neutral-500 hover:bg-neutral-800"
              onClick={(e) => {
                e.preventDefault();
                setPlatformMenu(!platformMenu);
              }}
            >
              <Image
                src={selectedPlatform.logo_url || '/placeholder.png'}
                className="h-auto w-4"
                width={128}
                height={128}
                alt={`${selectedPlatform.platform_abbrev || 'Platform'} Logo`}
              />
              <p className="text-xs md:text-base">{selectedPlatform.platform_title || 'Select Platform'}</p>
            </button>

            {/* Dropdown for Game Platform Selection */}
            {platformMenu && (
              <motion.div
                className="absolute z-10 mt-12 flex w-full flex-col rounded-md border-2 border-neutral-600 bg-neutral-900 shadow-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {platforms.map((platform, index) => (
                  <button
                    key={index}
                    className={`flex items-center gap-2 px-4 py-2 text-left text-neutral-300 hover:text-white ${
                      platform.id === selectedPlatform.id ? 'bg-neutral-800' : 'bg-[var(--background)]'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedPlatform(platform);
                      setPlatformMenu(false);
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
      </div>
    </form>
  );
}
