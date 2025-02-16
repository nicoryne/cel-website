'use client';

import React from 'react';
import { ValorantMatchesPlayerStatsWithDetails, Player, Character } from '@/lib/types';
import PlayerStatsRow from './row';
import { header } from 'framer-motion/client';

type ValidatePlayerStatisticsProps = {
  playerStatsList: Partial<ValorantMatchesPlayerStatsWithDetails>[];
  onSubmit: (updatedStats: Partial<ValorantMatchesPlayerStatsWithDetails>[]) => void;
  onChange: (index: number, field: keyof ValorantMatchesPlayerStatsWithDetails, value: any) => void;
  availablePlayers: Record<string, Player[] | null>;
  valorantCharacters: Character[];
};

export default function PlayerStatsTable({
  playerStatsList,
  onChange,
  onSubmit,
  availablePlayers,
  valorantCharacters
}: ValidatePlayerStatisticsProps) {
  const headers = [
    'Agent',
    'Player',
    'ACS',
    'Kills',
    'Deaths',
    'Assists',
    'Econ Rating',
    'First Bloods',
    'Plants',
    'Defuses',
    'is MVP?'
  ];

  const defaultPlayerStats: Partial<ValorantMatchesPlayerStatsWithDetails> = {
    agent: undefined,
    player: undefined,
    acs: undefined,
    kills: undefined,
    deaths: undefined,
    assists: undefined,
    econ_rating: undefined,
    first_bloods: undefined,
    plants: undefined,
    defuses: undefined,
    is_mvp: false
  };

  // Ensure there are at least 10 rows
  const filledPlayerStatsList = [
    ...playerStatsList,
    ...Array(Math.max(0, 10 - playerStatsList.length)).fill(defaultPlayerStats)
  ];

  return (
    <div className="w-full rounded-md border border-neutral-700 bg-neutral-900 p-4 text-neutral-600">
      <h2 className="text-lg font-semibold text-neutral-200">Editable Player Statistics</h2>
      <table className="w-full table-auto border-separate border-spacing-y-2">
        <thead>
          <tr className="bg-neutral-800">
            {headers.map((header, index) => (
              <th key={index} className="p-2 text-center text-neutral-400">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filledPlayerStatsList.map((playerStat, index) => {
            const key = index;
            const players = Object.values(availablePlayers).flat().filter(Boolean) as Player[];
            return (
              <PlayerStatsRow
                key={key}
                index={key}
                playerStats={playerStat}
                availablePlayers={players}
                valorantCharacters={valorantCharacters}
                onChange={onChange}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
