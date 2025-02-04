import { Team } from '@/lib/types';
import Image from 'next/image';

interface PlayoffsMatchupProps {
  team_a: Team;
  team_b: Team;
  team_a_status: string;
  team_b_status: string;
  team_a_score: number;
  team_b_score: number;
}

interface ComponentProps {
  team: Team;
  status: string;
  score: number;
}

const PlayoffsMatchupComponent = ({ team, status, score }: ComponentProps) => {
  return (
    <div
      className={`border-l-4 dark:border-b-neutral-700 ${status === 'Win' ? 'border-l-ultramarine dark:border-l-yale' : 'border-l-neutral-400 dark:border-l-neutral-600'}`}
    >
      <div
        className={`flex items-center gap-2 px-6 py-4 ${status === 'Win' ? 'opacity-100' : 'opacity-40'}`}
      >
        <Image
          src={team.logo_url}
          alt={`${team.school_abbrev} Logo`}
          width={64}
          height={64}
          className="h-auto w-8"
        />
        <span className="px-4 text-sm lg:hidden">{team.school_abbrev}</span>
        <span className="hidden px-4 text-sm lg:block">{team.school_name}</span>
        <span
          className={`ml-auto ${status === 'Win' && 'font-bold text-ultramarine dark:text-yale'}`}
        >
          {score}
        </span>
      </div>
    </div>
  );
};
export default function PlayoffsMatchup({
  team_a,
  team_b,
  team_a_status,
  team_b_status,
  team_a_score,
  team_b_score
}: PlayoffsMatchupProps) {
  return (
    <div className="flex w-96 flex-col shadow-md dark:bg-neutral-900">
      <PlayoffsMatchupComponent team={team_a} status={team_a_status} score={team_a_score} />
      <PlayoffsMatchupComponent team={team_b} status={team_b_status} score={team_b_score} />
    </div>
  );
}
