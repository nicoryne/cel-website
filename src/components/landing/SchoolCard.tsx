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
      className="cursor-grab space-y-2 p-2"
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Go to ${school.school_abbrev} page`}
    >
      <Image
        className="h-auto w-16 md:w-20"
        width={100}
        height={100}
        src={school.logo_url}
        alt={`${school.school_abbrev} Logo`}
        quality={90}
      />
    </motion.figure>
  );
}
