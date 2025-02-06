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
    <section aria-labelledby="schools-heading" className="bg-white px-8 pb-16 pt-6 dark:bg-white">
      <header className="mx-auto mb-8 w-fit">
        <h4
          id="schools-heading"
          className="border-b bg-blue-red-gradient bg-clip-text py-4 text-center text-xl font-bold text-transparent md:text-3xl"
        >
          Participating Schools
        </h4>
      </header>

      <div className="mx-auto flex flex-row flex-wrap place-items-center justify-center gap-16 md:w-[60vw] xl:w-full">
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
                width={200}
                height={200}
                src={team.logo_url}
                alt={`${team.school_abbrev} Logo`}
                quality={90}
              />
            </MotionComponent>
          ))}
      </div>
    </section>
  );
}
