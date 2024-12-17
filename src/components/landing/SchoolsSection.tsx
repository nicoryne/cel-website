'use client';

import { Team } from '@/lib/types';
import SchoolCard from '@/components/landing/SchoolCard';
import { motion } from 'framer-motion';

interface SchooLsSectionProps {
  teamList: Team[];
}

export default function SchoolsSection({ teamList }: SchooLsSectionProps) {
  return (
    <section aria-labelledby="schools-heading" className="bg-white px-8 py-16">
      <header className="mx-auto mb-8 w-fit">
        <h2
          id="schools-heading"
          className="border-b-2 border-[var(--cel-red)] py-4 text-center text-4xl font-bold text-[var(--cel-red)]"
        >
          Participating Schools
        </h2>
      </header>

      <div className="flex flex-row flex-wrap place-items-center justify-center gap-16">
        {teamList.map((team, index) => (
          <SchoolCard school={team} key={index} />
        ))}
      </div>
    </section>
  );
}
