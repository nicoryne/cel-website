import { getAllCharacters } from '@/services/characters';
import { getAllGamePlatforms } from '@/services/game-platform';
import { getAllMlbbMatches } from '@/services/mlbb-match';
import { getAllPlayers } from '@/services/player';
import { getAllTeams } from '@/services/team';
import { getAllValorantMatches } from '@/services/valorant-match';
import StatisticsBase from './_components/statistics-base';
import { Suspense } from 'react';
import Loading from '@/components/loading';
import { getAllLeagueSchedules } from '@/services/league-schedule';
import { MlbbMatchesPlayerStats, ValorantMatchesPlayerStats } from '@/lib/types';
import { getMlbbMatchPlayerStatByPlayerId } from '@/services/mlbb-match-player-stat';
import { getValorantMatchPlayerStatByPlayerId } from '@/services/valorant-match-player-stat';
import { getAllSeries } from '@/services/series';

export default async function StatisticsPage() {
  const platforms = await getAllGamePlatforms();
  const valorantMatches = await getAllValorantMatches();
  const mlbbMatches = await getAllMlbbMatches();
  const characters = await getAllCharacters();
  const teams = await getAllTeams();
  const players = await getAllPlayers();
  const schedules = await getAllLeagueSchedules();
  const series = await getAllSeries();

  const mlbbPlatform = platforms.find((p) => p.platform_abbrev === 'MLBB');
  const mlbbPlayers = Array.from(players.filter((p) => p.platform_id === mlbbPlatform?.id));

  const valoPlatform = platforms.find((p) => p.platform_abbrev === 'VALO');
  const valoPlayers = Array.from(players.filter((p) => p.platform_id === valoPlatform?.id));

  const mlbbPlayerMatchRecord: Record<string, MlbbMatchesPlayerStats[] | null> = {};
  const valoPlayerMatchRecord: Record<string, ValorantMatchesPlayerStats[] | null> = {};

  await Promise.all(
    mlbbPlayers.map(async (p) => {
      mlbbPlayerMatchRecord[p.id] = await getMlbbMatchPlayerStatByPlayerId(p.id);
    })
  );

  await Promise.all(
    valoPlayers.map(async (p) => {
      valoPlayerMatchRecord[p.id] = await getValorantMatchPlayerStatByPlayerId(p.id);
    })
  );

  return (
    <div className="mx-auto mt-20 overflow-hidden md:mt-28 md:w-[900px] lg:w-[1500px]">
      <Suspense fallback={<Loading />}>
        <StatisticsBase
          platforms={platforms}
          valorantMatches={valorantMatches}
          mlbbMatches={mlbbMatches}
          characters={characters}
          teams={teams}
          players={players}
          schedules={schedules}
          valoPlayerMatchRecord={valoPlayerMatchRecord}
          mlbbPlayerMatchRecord={mlbbPlayerMatchRecord}
          series={series}
        />
      </Suspense>
    </div>
  );
}
