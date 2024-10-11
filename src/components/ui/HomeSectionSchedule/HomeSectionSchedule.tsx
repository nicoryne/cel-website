'use client';
import Image from 'next/image';
import mlbb_logo from '@/public/logos/mlbb.webp';
import valorant_logo from '@/public/logos/valorant.webp';
import { useState } from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';
import {
  Switch,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from '@headlessui/react';

const leagueSchedules = [
  { id: 1, schedule: 'Preseason 3' },
  { id: 2, schedule: 'Regular Season 3' }
];

export default function HomeSectionSchedule() {
  // Platform Switches Use State
  const [mlbbEnabled, setMlbbEnabled] = useState(true);
  const [valoEnabled, setValoEnabled] = useState(true);

  // League Schedule Use State
  const [selectedLeagueSchedule, setSelectedLeagueSchedule] = useState(
    leagueSchedules[0]
  );

  return (
    <main className="flex min-w-full items-center justify-center">
      <div className="flex w-full items-center justify-between xl:w-[50%]">
        {/* Control Panel */}
        <div className="flex w-full rounded-2xl bg-[var(--accent-black)] p-8">
          {/* Season */}
          <div className="flex flex-1">
            <Listbox
              value={selectedLeagueSchedule}
              onChange={setSelectedLeagueSchedule}
            >
              <ListboxButton>{selectedLeagueSchedule.schedule}</ListboxButton>
              <ListboxOptions
                anchor="bottom"
                className="[--anchor-gap:4px] sm:[--anchor-gap:8px]"
              >
                {leagueSchedules.map((leagueSchedule) => (
                  <ListboxOption
                    key={leagueSchedule.schedule}
                    value={leagueSchedule}
                    className="group flex gap-2 bg-[var(--background)] p-2 data-[focus]:bg-black"
                  >
                    <CheckIcon className="invisible size-5 group-data-[selected]:visible" />
                    {leagueSchedule.schedule}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Listbox>
          </div>
          {/* Platform Switches */}
          <div className="flex justify-between">
            {/* MLBB Switch */}
            <div className="mx-4 flex items-center">
              <Image className="mr-2 h-8 w-8" src={mlbb_logo} alt="MLBB Logo" />
              <Switch
                checked={mlbbEnabled}
                onChange={setMlbbEnabled}
                className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-[var(--accent-secondary)]"
              >
                <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
              </Switch>
            </div>

            <div className="mx-4 flex items-center">
              <Image
                className="mr-2 h-8 w-8"
                src={valorant_logo}
                alt="VALORANT Logo"
              />
              <Switch
                checked={valoEnabled}
                onChange={setValoEnabled}
                className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-[var(--accent-primary)]"
              >
                <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
              </Switch>
            </div>
          </div>
        </div>

        {/* Match Schedules */}
        <div></div>
      </div>
    </main>
  );
}
