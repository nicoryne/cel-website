import { getAllGamePlatforms, getGamePlatformByAbbrev } from '@/api/game-platform';
import { getPlayerById, getPlayersByPlatform } from '@/api/player';
import { getValorantCompiledStatsByPlayer } from '@/api/valorant-match-player-stat';
import Dropdown from '@/components/ui/dropdown';
import DropdownItem from '@/components/ui/dropdown-item';
import { Player } from '@/lib/types';
import StatisticsBase from '@/app/(user)/statistics/_components/statistics-base';

export default function StatisticsPage() {
  const gamePlatforms = getAllGamePlatforms();

  return (
    <div className="mx-auto mt-24 px-8 pb-8 md:w-[800px] lg:w-[1100px]">
      <StatisticsBase platforms={gamePlatforms} />
    </div>
  );
}
