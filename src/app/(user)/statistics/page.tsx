import { getGamePlatformByAbbrev } from '@/api/game-platform';
import { getPlayerById, getPlayersByPlatform } from '@/api/player';
import { getValorantCompiledStatsByPlayer } from '@/api/valorant-match-player-stat';
import { Player } from '@/lib/types';
import TestComponent from './_ui/test';

export default async function StatisticsPage() {
  const valorantPlatform = await getGamePlatformByAbbrev('VALO');
  let valorantPlayers: Player[] = [];
  let compiledStats: any[] = [];

  if (valorantPlatform) {
    valorantPlayers = await getPlayersByPlatform(valorantPlatform.id);
  }

  if (valorantPlayers.length > 0) {
    const fetchPlayerStats = async (player: Player) => {
      const data = await getValorantCompiledStatsByPlayer(player.id);

      if (data && Object.keys(data).length > 0) {
        const stats = {
          ...data,
          player: await getPlayerById(data.player_id),
          acs: data.acs / data.games
        };
        compiledStats.push(stats);
      }
    };

    await Promise.all(valorantPlayers.map(fetchPlayerStats));
  }

  return (
    <div className="mt-40">
      <aside></aside>
      <main>
        {compiledStats && (
          <ul>
            <TestComponent data={compiledStats} />
            {compiledStats.map((stat, index) => (
              <li key={index}>
                <div className="font-bold"></div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
