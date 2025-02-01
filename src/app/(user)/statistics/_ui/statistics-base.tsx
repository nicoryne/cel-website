'use client';

import { useEffect, useState, use } from 'react';
import { GamePlatform, MlbbCompiledStats, Player, ValorantCompiledStats } from '@/lib/types';
import Dropdown from '@/components/ui/dropdown';
import DropdownItem from '@/components/ui/dropdown-item';
import Image from 'next/image';
import { getPlayerById, getPlayersByPlatform } from '@/api/player';
import { getValorantCompiledStatsByPlayer } from '@/api/valorant-match-player-stat';
import { getCharacterById } from '@/api/characters';

interface StatisticsBaseProps {
  platforms: Promise<GamePlatform[]>;
}

const valoHeaders = [
  'Player',
  'Agents',
  'Games',
  'Rounds',
  'ACS',
  'MVPs',
  'KPG',
  'DPG',
  'APG',
  'FKPG',
  'PPG',
  'DPG',
  'K',
  'D',
  'A'
];

export default function StatisticsBase({ platforms }: StatisticsBaseProps) {
  // Fetch players first
  // Fetch stat per player
  // Process each stat as fetching

  const processedPlatforms = use(platforms);

  const [tableHeader, setTableHeader] = useState(valoHeaders);
  const [tableBody, setTableBody] = useState([]);
  const [currentPlatform, setCurrentPlatform] = useState<GamePlatform>(processedPlatforms[1]);

  const [valorantData, setValorantData] = useState<any[]>([]);
  const [mlbbData, setMlbbData] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlayerStats = async (player: Player) => {
      const data = await getValorantCompiledStatsByPlayer(player.id);

      if (data && Object.keys(data).length > 0) {
        const stats = {
          ...data,
          player: await getPlayerById(data.player_id),
          agent: await getCharacterById(data.agent_id),
          acs: data.acs / data.games
        };
        setValorantData((prev) => [...prev, stats]);
      }
    };

    const fetchData = async (platform: GamePlatform) => {
      const players = await getPlayersByPlatform(platform.id);

      await Promise.all(players.map(fetchPlayerStats));
    };

    if (currentPlatform === processedPlatforms[1] && valorantData.length === 0) {
      fetchData(currentPlatform);
    }
  }, [currentPlatform]);

  return (
    <>
      <aside>
        <Dropdown value={currentPlatform.platform_abbrev} image={currentPlatform.logo_url}>
          {processedPlatforms.map((platform) => (
            <DropdownItem
              onClick={() => {
                setCurrentPlatform(platform);
              }}
              selected={platform === currentPlatform}
            >
              <div className="flex items-center justify-between gap-12">
                <p className="break-words text-xs">{platform.platform_abbrev}</p>
                <Image
                  src={platform.logo_url}
                  className="h-auto w-4"
                  width={128}
                  height={128}
                  alt={`${platform.platform_abbrev} Logo`}
                />
              </div>
            </DropdownItem>
          ))}
        </Dropdown>
      </aside>
      <main className="border-2">
        <table className="w-full table-auto border-2">
          <thead>
            <tr>
              {valoHeaders.map((header) => (
                <th>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {valorantData.map((data) => (
              <tr>
                <td>{data.player.ingame_name}</td>
                <td>{data.agent.name}</td>
                <td>{data.games}</td>
                <td>{data.rounds}</td>
                <td>{Math.round(parseFloat(data.acs))}</td>
                <td>{data.mvps}</td>
                <td>{data.kills / data.games}</td>
                <td>{data.deaths / data.games}</td>
                <td>{Math.round(data.assists / data.games)}</td>
                <td>{data.first_bloods / data.games}</td>
                <td>{Math.round(data.plants / data.games)}</td>
                <td>{data.defuses / data.games}</td>
                <td>{data.kills}</td>
                <td>{data.deaths}</td>
                <td>{data.assists}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}
