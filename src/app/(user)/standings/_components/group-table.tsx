import GroupContainer from '@/app/(user)/standings/_components/group-container';
import { GroupStanding } from '@/app/(user)/standings/_views/utils';

interface GroupTableProps {
  groupStanding: GroupStanding[];
  isValorant: boolean;
  showRoundDiff: boolean;
}

export default function GroupTable({ groupStanding, isValorant, showRoundDiff }: GroupTableProps) {
  return (
    <table className="w-full">
      <thead className="border-b dark:border-neutral-700">
        <tr>
          <th></th>
          {isValorant ? (
            <th className="p-2 text-center text-xs font-semibold">W-D-L</th>
          ) : (
            <th className="p-2 text-center text-xs font-semibold">W-L</th>
          )}
          <th className="hidden p-2 text-center text-xs font-semibold md:block">GAMES</th>
          {showRoundDiff && isValorant && (
            <th className="p-2 text-center text-xs font-semibold">RNDΔ</th>
          )}
          {showRoundDiff && !isValorant && (
            <th className="p-2 text-center text-xs font-semibold">WIN DUR.</th>
          )}
          <th className="p-2 text-center text-xs font-semibold">PTS</th>
        </tr>
      </thead>
      <tbody>
        {groupStanding.map((standing, index) => (
          <GroupContainer
            standing={standing}
            index={index}
            isValorant={isValorant}
            showRoundDiff={showRoundDiff}
          />
        ))}
      </tbody>
    </table>
  );
}
