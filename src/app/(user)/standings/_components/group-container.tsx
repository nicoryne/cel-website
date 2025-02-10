import { GroupStanding } from '@/app/(user)/standings/_views/utils';
import not_found from '@/../../public/images/not-found.webp';
import Image from 'next/image';

interface GroupContainer {
  standing: GroupStanding;
  index: number;
  isValorant: boolean;
  showRoundDiff: boolean;
}

export default function GroupContainer({
  standing,
  index,
  isValorant,
  showRoundDiff
}: GroupContainer) {
  return (
    <tr key={index} className="h-2/4 items-center gap-4 border-b p-4 dark:border-neutral-700">
      <td>
        <div className="flex items-center gap-4 px-1 py-4 sm:p-4">
          <Image
            src={standing.team?.logo_url || not_found}
            alt={standing.team?.school_abbrev || 'Logo not found'}
            width={128}
            height={128}
            className="h-auto w-8 rounded-full md:w-12"
          />
          <div className="flex flex-col gap-1">
            <span className="hidden text-xs font-semibold sm:block md:hidden 2xl:block">
              {standing.team?.school_name}
            </span>
            <span className="block text-xs font-semibold sm:hidden sm:text-base md:block 2xl:hidden">
              {standing.team?.school_abbrev}
            </span>
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              {standing.team?.team_name}
            </span>
          </div>
        </div>
      </td>
      <td className="text-center">
        <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
          {!isValorant
            ? `${standing.wins} - ${standing.losses}`
            : `${standing.wins} - ${standing.losses} - ${standing.draws}`}
        </span>
      </td>
      <td className="hidden text-center md:table-cell">
        <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
          {`${standing.wins + standing.losses + standing.draws}`}
        </span>
      </td>
      {showRoundDiff && isValorant && (
        <td className="text-center">
          <span
            className={`text-xs font-semibold ${
              standing.roundDiff
                ? standing.roundDiff > 0
                  ? 'text-green-400 dark:text-green-300'
                  : 'text-red-500 dark:text-red-400'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            {standing.roundDiff
              ? standing.roundDiff > 0
                ? `+${standing.roundDiff}`
                : standing.roundDiff
              : '0'}
          </span>
        </td>
      )}
      {showRoundDiff && !isValorant && (
        <td className="text-center">
          <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
            {`${standing.matchDuration}`}
          </span>
        </td>
      )}
      <td className="text-center">
        <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
          {standing.points}
        </span>
      </td>
    </tr>
  );
}
