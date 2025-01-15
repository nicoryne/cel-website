'use client';
import React from 'react';
import { Team } from '@/lib/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { getCharactersCount } from '@/api/characters';

type SchoolsSectionProps = {
  teams: Promise<Team[]>;
};

const fetchTeams = (teams: Promise<Team[]>) => {
  const data = React.use(teams);

  return data.filter((team) => team.school_abbrev !== 'TBD');
};

export default function SchoolsSection({ teams }: SchoolsSectionProps) {
  const filteredTeams = fetchTeams(teams);

  return (
    <section
      aria-labelledby="schools-heading"
      className="bg-white px-8 py-16 dark:bg-white"
    >
      <header className="mx-auto mb-8 w-fit">
        <h2
          id="schools-heading"
          className="border-b-2 border-[var(--cel-red)] py-4 text-center text-4xl font-bold text-[var(--cel-red)]"
        >
          Participating Schools
        </h2>
      </header>

      <div className="flex flex-row flex-wrap place-items-center justify-center gap-16">
        {filteredTeams.map((team, index) => (
          <motion.figure
            key={index}
            className="cursor-grab space-y-2 p-2"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Go to ${team.school_abbrev} page`}
          >
            <Image
              className="h-auto w-16 md:w-20"
              width={100}
              height={100}
              src={team.logo_url}
              alt={`${team.school_abbrev} Logo`}
              quality={90}
            />
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
