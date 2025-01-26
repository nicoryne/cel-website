import { Suspense } from 'react';
import Image from 'next/image';
import { getAllTeams } from '@/api/team';
import MotionComponent from '@/components/ui/motion-component';

const fetchTeams = async () => {
  const data = await getAllTeams();

  return data.filter((team) => team.school_abbrev !== 'TBD');
};

export default async function SchoolsSection() {
  const filteredTeams = await fetchTeams();

  return (
    <section aria-labelledby="schools-heading" className="bg-white px-8 py-16 dark:bg-white">
      <header className="mx-auto mb-8 w-fit">
        <h2 id="schools-heading" className="sr-only">
          Participating Schools
        </h2>
      </header>

      <div className="flex flex-row flex-wrap place-items-center justify-center gap-16">
        <Suspense>
          {filteredTeams &&
            filteredTeams.map((team, index) => (
              <MotionComponent
                type="figure"
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
              </MotionComponent>
            ))}
        </Suspense>
      </div>
    </section>
  );
}
