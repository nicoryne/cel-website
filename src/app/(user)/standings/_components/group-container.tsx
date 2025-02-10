import { Team } from '@/lib/types';
import { GroupResults } from '@/app/(user)/standings/_views/groupstage';
import not_found from '@/../../public/images/not-found.webp';
import Image from 'next/image';

interface GroupContainer {
  team: Team | undefined;
  results: GroupResults;
  index: number;
  isValorant: boolean;
  showRoundDiff: boolean;
}

export default function GroupContainer({
  team,
  results,
  index,
  isValorant,
  showRoundDiff
}: GroupContainer) {
  return (
    <li
      key={team?.id}
      className="flex h-2/4 items-center gap-4 border-b p-4 dark:border-neutral-700"
    >
      <span className="font-bold">{index + 1}</span>
      <Image
        src={team?.logo_url || not_found}
        alt={team?.school_abbrev || 'Logo not found'}
        width={128}
        height={128}
        className="h-auto w-8 rounded-full md:w-16"
      />
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full justify-between">
          <span className="block text-sm sm:hidden lg:block">{team?.school_name}</span>
          <span className="hidden text-sm sm:block lg:hidden">{team?.school_abbrev}</span>
          {showRoundDiff && isValorant && (
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
              R.DIFF (
              {`${results.roundDiff ? `${results.roundDiff > 0 ? `+${results.roundDiff}` : `${results.roundDiff}`}` : '0'}`}
              )
            </span>
          )}
        </div>
        <div className="flex w-full justify-between">
          <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
            {!isValorant
              ? `${results.wins}W - ${results.losses}L`
              : `${results.wins}W - ${results.losses}L - ${results.draws}D`}
          </span>
          <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
            {`${results.points}${results.points === 1 ? 'pt' : 'pts'}`}
          </span>
        </div>
      </div>
    </li>
  );
}
