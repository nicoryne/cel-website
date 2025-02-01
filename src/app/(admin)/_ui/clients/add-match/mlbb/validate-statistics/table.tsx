'use client';

import React from 'react';
import { Player, Character, MlbbMatchesPlayerStatsWithDetails } from '@/lib/types';
import PlayerStatsRow from '@/app/(admin)/_ui/clients/add-match/mlbb/validate-statistics/row';

type ValidatePlayerStatisticsProps = {
  playerStatsList: Partial<MlbbMatchesPlayerStatsWithDetails>[];
  onChange: (index: number, field: keyof MlbbMatchesPlayerStatsWithDetails, value: any) => void;
  availablePlayers: Player[];
  mlbbCharacters: Character[];
};

export default function PlayerStatsTable({
  playerStatsList,
  onChange,
  availablePlayers,
  mlbbCharacters
}: ValidatePlayerStatisticsProps) {
  const headers = [
    'Hero',
    'Player',
    'R',
    'K',
    'D',
    'A',
    'Net Worth',
    'HERO DMG',
    'TURR DMG',
    'DMG TKN',
    'TF PP',
    'Lord Slain',
    'Turtle Slain',
    'is MVP?'
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
          {playerStatsList.map((playerStat, index) => {
            const key = index;
            return (
              <PlayerStatsRow
                key={key}
                index={key}
                playerStats={playerStat}
                availablePlayers={availablePlayers}
                mlbbCharacters={mlbbCharacters}
                onChange={onChange}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
