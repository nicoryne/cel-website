import { Team } from '@/lib/types';
import Image from 'next/image';

interface PlayoffsMatchup {
  team_a: Team;
  team_b: Team;
  team_a_status: string;
  team_b_status: string;
  team_a_score: number;
  team_b_score: number;
}
export default function PlayoffsMatchup({
  team_a,
  team_b,
  team_a_status,
  team_b_status,
  team_a_score,
  team_b_score
}: PlayoffsMatchup) {
  return (
    <div className="flex w-96 flex-col shadow-md dark:bg-neutral-900">
      <div
        className={`border-b border-l-4 dark:border-b-neutral-700 ${team_a_status === 'Win' ? 'border-l-ultramarine' : 'border-l-neutral-400 dark:border-l-neutral-600'}`}
      >
        <div
          className={`flex w-full items-center gap-2 p-4 ${team_a_status === 'Win' ? 'opacity-100' : 'opacity-40'}`}
        >
          <Image
            src={team_a.logo_url}
            alt={`${team_a.school_abbrev} Logo`}
            width={64}
            height={64}
            className="h-auto w-10"
          />
          <span className="text-xs md:text-sm">{team_a.school_name}</span>
          <span className={`ml-auto ${team_a_status === 'Win' && 'font-bold text-federal'}`}>
            {team_a_score}
          </span>
        </div>
      </div>
      <div
        className={`border-b border-l-4 dark:border-b-neutral-700 ${team_b_status === 'Win' ? 'border-l-ultramarine' : 'border-l-neutral-400 dark:border-l-neutral-600'}`}
      >
        <div
          className={`flex w-full items-center gap-2 p-4 ${team_b_status === 'Win' ? 'opacity-100' : 'opacity-40'}`}
        >
          <Image
            src={team_b.logo_url}
            alt={`${team_b.school_abbrev} Logo`}
            width={64}
            height={64}
            className="h-auto w-10"
          />
          <span className="text-xs md:text-sm">{team_b.school_name}</span>
          <span className={`ml-auto ${team_b_status === 'Win' && 'font-bold text-federal'}`}>
            {team_b_score}
          </span>
        </div>
      </div>
    </div>
  );
}
