'use client';
import React, { useState, useEffect } from 'react';
import { Player, ValorantMatchesPlayerStatsWithDetails } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';

type PlayerStatsRowProps = {
  playerStats: Partial<ValorantMatchesPlayerStatsWithDetails>;
  availablePlayers: Player[] | null;
};

export default function PlayerStatsRow({ playerStats, availablePlayers }: PlayerStatsRowProps) {
  const [openAgentMenu, setOpenAgetMenu] = useState(false);
  const [openPlayerMenu, setOpenPlayerMenu] = useState(false);
  console.log(availablePlayers);

  return (
    <tr className="border-b border-neutral-700 bg-neutral-900 hover:bg-neutral-800">
      <td className="p-2 text-center">
        <button className="text-sm text-neutral-300">Agent</button>
      </td>
      <td className="p-2 text-center">
        <button
          type="button"
          id="player"
          name="player"
          className="flex h-10 w-full items-center justify-center gap-2 rounded-md border-2 border-neutral-600 bg-neutral-900 text-white hover:border-neutral-500 hover:bg-neutral-800"
          onClick={() => setOpenPlayerMenu(!openPlayerMenu)}
        >
          {playerStats.player?.ingame_name || 'Select Player'}
        </button>
        <AnimatePresence>
          {openPlayerMenu && availablePlayers && (
            <motion.div
              className="absolute flex flex-col place-self-center rounded-md border-2 border-neutral-600 bg-neutral-800 shadow-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 20 }}
            >
              {availablePlayers.map((player, index) => (
                <button
                  key={index}
                  className={`h-10 w-full px-4 text-left text-sm text-neutral-300 hover:bg-neutral-700 ${
                    player === playerStats.player ? 'bg-neutral-700' : ''
                  }`}
                  onClick={() => {
                    setOpenPlayerMenu(!openPlayerMenu);
                  }}
                >
                  {player.ingame_name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </td>
      <td className="p-2 text-center">{playerStats.acs}</td>
      <td className="p-2 text-center">{playerStats.kills}</td>
      <td className="p-2 text-center">{playerStats.deaths}</td>
      <td className="p-2 text-center">{playerStats.assists}</td>
      <td className="p-2 text-center">{playerStats.econ_rating}</td>
      <td className="p-2 text-center">{playerStats.first_bloods}</td>
      <td className="p-2 text-center">{playerStats.plants}</td>
      <td className="p-2 text-center">{playerStats.defuses}</td>
    </tr>
  );
}
