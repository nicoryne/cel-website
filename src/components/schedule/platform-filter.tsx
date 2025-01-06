import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FilterState } from '@/components/schedule/types';

type PlatformFilterProps = {
  platformOptions: FilterState[];
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  menuFilterState: boolean;
  toggleMenuFilter: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PlatformFilter({
  platformOptions,
  filterState,
  setFilterState,
  menuFilterState,
  toggleMenuFilter
}: PlatformFilterProps) {
  return (
    <div>
      <span className="text-xs text-neutral-500">Filter Game</span>
      <div className="flex flex-col space-y-12">
        <button
          className="flex h-10 w-24 items-center justify-center gap-2 bg-neutral-800 text-xs text-white transition-colors duration-150 ease-linear hover:bg-neutral-700"
          onClick={() => toggleMenuFilter(!menuFilterState)}
        >
          <Image
            src={filterState.logo}
            className="h-auto w-4"
            width={128}
            height={128}
            alt={`${filterState.abbrev} Logo`}
          />
          {filterState.abbrev}
        </button>

        {menuFilterState && (
          <motion.div
            className="absolute flex flex-col flex-wrap rounded-md shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 100, y: 0 }}
          >
            {platformOptions.map((platform, index) => (
              <button
                className={`flex h-16 w-36 items-center justify-center gap-2 text-neutral-300 hover:text-white ${platform.abbrev === filterState.abbrev ? 'bg-neutral-800' : 'bg-[var(--background)]'}`}
                key={index}
                onClick={() => {
                  setFilterState(platform), toggleMenuFilter(!menuFilterState);
                }}
              >
                <Image
                  src={platform.logo}
                  className="h-auto w-4"
                  width={128}
                  height={128}
                  alt={`${platform.abbrev} Logo`}
                />
                <p className="w-24 break-words text-xs">{platform.title}</p>
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
