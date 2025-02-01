'use client';
import React from 'react';
import { Character, MlbbMatchesPlayerStatsWithDetails, Player } from '@/lib/types';

type PlayerStatsRowProps = {
  index: number;
  playerStats: Partial<MlbbMatchesPlayerStatsWithDetails>;
  availablePlayers: Player[] | null;
  onChange: (index: number, field: keyof MlbbMatchesPlayerStatsWithDetails, value: any) => void;
  mlbbCharacters: Character[];
};

export default function PlayerStatsRow({
  index,
  playerStats,
  availablePlayers,
  mlbbCharacters,
  onChange
}: PlayerStatsRowProps) {
  type NumericFields = {
    [K in keyof MlbbMatchesPlayerStatsWithDetails]: MlbbMatchesPlayerStatsWithDetails[K] extends number
      ? K
      : never;
  }[keyof MlbbMatchesPlayerStatsWithDetails];

  const numerics: NumericFields[] = [
    'rating',
    'kills',
    'deaths',
    'assists',
    'net_worth',
    'hero_dmg',
    'turret_dmg',
    'dmg_tkn',
    'teamfight',
    'lord_slain',
    'turtle_slain'
  ];
  return (
    <tr className="border-b border-neutral-700 bg-neutral-900 hover:bg-neutral-800">
      {/* Agent Dropdown */}
      <td className="p-2 text-center">
        {mlbbCharacters && (
          <select
            className={`rounded-md border bg-neutral-800 text-left text-sm text-neutral-200 focus:outline-none ${
              !playerStats.hero ? 'border-red-500' : 'border-neutral-700'
            }`}
            value={playerStats.hero?.name || 'NULL'}
            onChange={(e) => {
              const selectedCharacter = mlbbCharacters.find(
                (character) => character.name === e.target.value
              );
              onChange(index, 'hero', selectedCharacter || null);
            }}
          >
            <option value="NULL">Select Hero</option>
            {mlbbCharacters.map((character) => (
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
            className={`rounded-md border bg-neutral-800 text-left text-sm text-neutral-200 focus:outline-none ${
              !playerStats.player ? 'border-red-500' : 'border-neutral-700'
            }`}
            value={playerStats.player?.ingame_name || 'NULL'}
            onChange={(e) => {
              const selectedPlayer = availablePlayers.find(
                (player) => player.ingame_name === e.target.value
              );
              onChange(index, 'player', selectedPlayer || null);
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
              className={`w-full rounded-md border bg-neutral-800 px-2 py-1 text-center text-sm text-neutral-200 focus:outline-none ${isInvalid ? 'border-red-500' : 'border-neutral-700'}`}
              value={value ?? ''}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                onChange(
                  index,
                  field as keyof MlbbMatchesPlayerStatsWithDetails,
                  isNaN(newValue) ? null : newValue
                );
              }}
            />
          </td>
        );
      })}

      <td className="text-center">
        <input
          type="checkbox"
          className="px-2 py-1"
          checked={!!playerStats?.is_mvp}
          onChange={({ target: { checked } }) => onChange(index, 'is_mvp', checked ? true : false)}
        />
      </td>
    </tr>
  );
}
