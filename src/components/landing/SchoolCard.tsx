'use client';

import React from 'react';
import { Team } from '@/lib/types';
import { motion } from 'framer-motion';
import Image from 'next/image';

type SchoolCardProps = {
  school: Team;
};

export default function SchoolCard({ school }: SchoolCardProps) {
  return (
    <motion.figure
      className="h-auto w-16 cursor-grab space-y-2 p-2 md:w-20"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Go to ${school.school_abbrev} page`}
    >
      <Image
        width={500}
        height={500}
        src={school.logo_url}
        alt={`${school.school_abbrev} Logo`}
        quality={90}
      />
    </motion.figure>
  );
}
