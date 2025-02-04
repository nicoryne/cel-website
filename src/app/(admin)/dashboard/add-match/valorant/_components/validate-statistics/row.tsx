'use client';
import React from 'react';
import { Character, Player, ValorantMatchesPlayerStatsWithDetails } from '@/lib/types';
import Dropdown from '@/components/ui/dropdown';
import DropdownItem from '@/components/ui/dropdown-item';

type PlayerStatsRowProps = {
  index: number;
  playerStats: Partial<ValorantMatchesPlayerStatsWithDetails>;
  availablePlayers: Player[] | null;
  onChange: (index: number, field: keyof ValorantMatchesPlayerStatsWithDetails, value: any) => void;
  valorantCharacters: Character[];
};

export default function PlayerStatsRow({
  index,
  playerStats,
  availablePlayers,
  valorantCharacters,
  onChange
}: PlayerStatsRowProps) {
  type NumericFields = {
    [K in keyof ValorantMatchesPlayerStatsWithDetails]: ValorantMatchesPlayerStatsWithDetails[K] extends number
      ? K
      : never;
  }[keyof ValorantMatchesPlayerStatsWithDetails];

  const numerics: NumericFields[] = [
    'acs',
    'kills',
    'deaths',
    'assists',
    'econ_rating',
    'first_bloods',
    'plants',
    'defuses'
  ];
  return (
    <tr className="border-b border-neutral-700 bg-neutral-900 hover:bg-neutral-800">
      {/* Agent Dropdown */}
      <td className="p-2 text-center">
        {valorantCharacters && (
          <select
            className="rounded-md border bg-neutral-800 text-left text-neutral-200 focus:outline-none"
            value={playerStats.agent?.name || 'NULL'}
            onChange={(e) => {
              const selectedCharacter = valorantCharacters.find((character) => character.name === e.target.value);
              if (selectedCharacter) {
                onChange(index, 'agent', selectedCharacter);
              }
            }}
          >
            <option value="NULL">Select Agent</option>
            {valorantCharacters.map((character) => (
              <option key={character.id} value={character.name}>
                {character.name}
              </option>
            ))}
          </select>
        )}
      </td>

      {/* Player Dropdown */}
      <td className="p-2 text-center">
        {availablePlayers && (
          <select
            className="rounded-md border bg-neutral-800 text-left text-neutral-200 focus:outline-none"
            value={playerStats.player?.ingame_name || 'NULL'}
            onChange={(e) => {
              const selectedPlayer = availablePlayers.find((player) => player.ingame_name === e.target.value);
              if (selectedPlayer) {
                onChange(index, 'player', selectedPlayer);
              }
            }}
          >
            <option value="NULL">Select Player</option>
            {availablePlayers.map((player) => (
              <option key={player.id} value={player.ingame_name}>
                {player.ingame_name}
              </option>
            ))}
          </select>
        )}
      </td>

      {/* Numeric Inputs */}
      {numerics.map((field) => {
        const value = playerStats[field as NumericFields];
        const isInvalid = value === null || isNaN(value as number);

        return (
          <td key={field} className="p-2 text-center">
            <input
              type="number"
              className={`w-full rounded-md border bg-neutral-800 px-2 py-1 text-center text-neutral-200 focus:outline-none ${isInvalid ? 'border-red-500' : 'border-neutral-700'}`}
              value={value ?? ''}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                onChange(
                  index,
                  field as keyof ValorantMatchesPlayerStatsWithDetails,
                  isNaN(newValue) ? null : newValue
                );
              }}
            />
          </td>
        );
      })}

      <td>
        <input
          type="checkbox"
          checked={!!playerStats?.is_mvp}
          onChange={({ target: { checked } }) => onChange(index, 'is_mvp', checked ? true : false)}
        />
      </td>
    </tr>
  );
}
