'use client';

import React from 'react';
import { ValorantMatchesPlayerStatsWithDetails, Player } from '@/lib/types';
import PlayerStatsRow from './row';
import { header } from 'framer-motion/client';

type ValidatePlayerStatisticsProps = {
  playerStatsList: Partial<ValorantMatchesPlayerStatsWithDetails>[];
  onSubmit: (updatedStats: Partial<ValorantMatchesPlayerStatsWithDetails>[]) => void;
  availablePlayers: Record<string, Player[] | null>;
};

export default function PlayerStatsTable({
  playerStatsList,
  onSubmit,
  availablePlayers
}: ValidatePlayerStatisticsProps) {
  const [editableStatsList, setEditableStatsList] = React.useState(playerStatsList);

  const handleCellChange = (index: number, field: keyof ValorantMatchesPlayerStatsWithDetails, value: string) => {
    const updatedStats = [...editableStatsList];
    const numericFields = ['acs', 'kills', 'deaths', 'assists', 'econ_rating', 'first_bloods', 'plants', 'defuses'];

    updatedStats[index] = {
      ...updatedStats[index],
      [field]: numericFields.includes(field) ? parseInt(value, 10) || 0 : value
    };
    setEditableStatsList(updatedStats);
  };

  const isValueInvalid = (field: keyof ValorantMatchesPlayerStatsWithDetails, value: any): boolean => {
    const numericFields = ['acs', 'kills', 'deaths', 'assists', 'econ_rating', 'first_bloods', 'plants', 'defuses'];
    if (numericFields.includes(field)) {
      return isNaN(value) || value < 0;
    }
    return false;
  };

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
    'Defuses'
  ];

  console.log(playerStatsList);
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
          {editableStatsList.map((playerStat, index) => {
            const players = availablePlayers[playerStat.player?.team_id as string] || [];
            return <PlayerStatsRow key={index} playerStats={playerStat} availablePlayers={players} />;
          })}
        </tbody>
      </table>
    </div>
  );
}
