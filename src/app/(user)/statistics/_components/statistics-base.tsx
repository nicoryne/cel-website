'use client';
import Dropdown from '@/components/ui/dropdown';
import DropdownItem from '@/components/ui/dropdown-item';
import {
  Character,
  GamePlatform,
  LeagueSchedule,
  MlbbCompiledStats,
  MlbbMatch,
  MlbbMatchesPlayerStats,
  Player,
  Series,
  Team,
  ValorantCompiledStats,
  ValorantMatch,
  ValorantMatchesPlayerStats
} from '@/lib/types';
import { mlbbHeaders, valoHeaders } from '@/app/(user)/statistics/_components/header';
import Image from 'next/image';
import { Suspense, useEffect, useState } from 'react';
import { ArrowsUpDownIcon } from '@heroicons/react/24/solid';
import { getMlbbCompiledStatsByPlayer } from '@/api/mlbb-match-player-stat';
import { getValorantMatchPlayerStatByPlayerId } from '@/api/valorant-match-player-stat';
import { processMlbbStats, processValorantStats } from './utils';
import Loading from '@/components/loading';

interface StatisticsBaseProps {
  platforms: GamePlatform[];
  valorantMatches: ValorantMatch[];
  mlbbMatches: MlbbMatch[];
  characters: Character[];
  teams: Team[];
  players: Player[];
  schedules: LeagueSchedule[];
  valoPlayerMatchRecord: Record<string, ValorantMatchesPlayerStats[] | null>;
  mlbbPlayerMatchRecord: Record<string, MlbbMatchesPlayerStats[] | null>;
  series: Series[];
}

export default function StatisticsBase({
  platforms,
  valorantMatches,
  mlbbMatches,
  characters,
  teams,
  players,
  schedules,
  valoPlayerMatchRecord,
  mlbbPlayerMatchRecord,
  series
}: StatisticsBaseProps) {
  teams.sort((a, b) => (a.school_abbrev === 'TBD' ? -1 : b.school_abbrev === 'TBD' ? 1 : 0));

  const seasonTypes = ['All', ...Array.from(new Set(schedules.map((s) => s.season_type)))];
  const [filteredValoMatchRecords, setFilteredValoMatchRecords] =
    useState<Record<string, ValorantMatchesPlayerStats[] | null>>(valoPlayerMatchRecord);
  const [filteredMlbbMatchRecords, setFilteredMlbbMatchRecords] =
    useState<Record<string, MlbbMatchesPlayerStats[] | null>>(mlbbPlayerMatchRecord);
  const [filterPlatform, setFilterPlatform] = useState<GamePlatform>(platforms[0]);
  const [filterTeam, setFilterTeam] = useState<Team>(teams[0]);
  const [filterSeasonType, setFilterSeasonType] = useState<string | null>(null);
  const [filterSeasonNumber, setFilterSeasonNumber] = useState<string | null>(null);
  const [filterLeagueStage, setFilterLeagueStage] = useState<string | null>(null);
  const [mlbbData, setMlbbData] = useState<MlbbCompiledStats[]>();
  const [valorantData, setValorantData] = useState<ValorantCompiledStats[]>();

  const mlbbPlatform = platforms.find((p) => p.platform_abbrev === 'MLBB');
  const mlbbPlayers = Array.from(players.filter((p) => p.platform_id === mlbbPlatform?.id));

  const valoPlatform = platforms.find((p) => p.platform_abbrev === 'VALO');
  const valoPlayers = Array.from(players.filter((p) => p.platform_id === valoPlatform?.id));

  const [filteredMlbbPlayers, setFilteredMlbbPlayers] = useState<Player[]>(mlbbPlayers);

  const [filteredValoPlayers, setFilteredValoPlayers] = useState<Player[]>(valoPlayers);

  const filteredSeasonNumbers =
    filterSeasonType && filterSeasonType !== 'All'
      ? [
          'All',
          ...Array.from(
            new Set(
              schedules
                .filter((s) => s.season_type === filterSeasonType)
                .map((s) => s.season_number)
            )
          )
        ]
      : ['All'];

  const filteredLeagueStages =
    filterSeasonNumber && filterSeasonNumber !== 'All'
      ? [
          'All',
          ...Array.from(
            new Set(
              schedules
                .filter(
                  (s) =>
                    s.season_type === filterSeasonType &&
                    s.season_number.toString() === filterSeasonNumber
                )
                .map((s) => s.league_stage)
            )
          )
        ]
      : ['All'];

  const headers = filterPlatform.platform_abbrev === 'MLBB' ? mlbbHeaders : valoHeaders;

  const filteredMlbbData =
    filterTeam.school_abbrev !== 'TBD'
      ? mlbbData?.filter((p) => p.player.team_id === filterTeam.id)
      : mlbbData;

  const filteredValorantData =
    filterTeam.school_abbrev !== 'TBD'
      ? valorantData?.filter((p) => p.player.team_id === filterTeam.id)
      : valorantData;

  const applyLeagueFilter = () => {
    // Step 1: Filter schedules based on selected filters
    const filteredSchedules = schedules.filter((schedule) => {
      const matchesSeasonType =
        filterSeasonType && filterSeasonType !== 'All'
          ? schedule.season_type === filterSeasonType
          : true;
      const matchesSeasonNumber =
        filterSeasonNumber && filterSeasonNumber !== 'All'
          ? schedule.season_number.toString() === filterSeasonNumber
          : true;
      const matchesLeagueStage =
        filterLeagueStage && filterLeagueStage !== 'All'
          ? schedule.league_stage === filterLeagueStage
          : true;

      return matchesSeasonType && matchesSeasonNumber && matchesLeagueStage;
    });

    if (filterPlatform.platform_abbrev === 'MLBB') {
      const filteredScheduleIds = new Set(filteredSchedules.map((s) => s.id));
      const relevantSeries = series.filter((s) => filteredScheduleIds.has(s.league_schedule_id));
      const relevantSeriesIds = new Set(relevantSeries.map((s) => s.id));
      const filteredMatches = mlbbMatches.filter((m) => relevantSeriesIds.has(m.series_id));
      const relevantMatchIds = new Set(filteredMatches.map((m) => m.id));

      const filteredPlayers = mlbbPlayers.filter((player) =>
        player.league_schedules?.some((scheduleId) =>
          filteredScheduleIds.has(scheduleId.league_schedule_id)
        )
      );

      const filteredPlayerIds = new Set(filteredPlayers.map((player) => player.id));

      setFilteredMlbbMatchRecords(() => {
        const updatedRecords: Record<string, MlbbMatchesPlayerStats[] | null> = {};

        Object.keys(mlbbPlayerMatchRecord).forEach((playerId) => {
          if (filteredPlayerIds.has(playerId)) {
            const playerStats = mlbbPlayerMatchRecord[playerId];

            if (playerStats) {
              updatedRecords[playerId] = playerStats.filter((match) =>
                relevantMatchIds.has(match.match_id)
              );
            }
          }
        });

        return updatedRecords;
      });
    } else {
      const filteredScheduleIds = new Set(filteredSchedules.map((s) => s.id));

      const relevantSeries = series.filter((s) => filteredScheduleIds.has(s.league_schedule_id));
      const relevantSeriesIds = new Set(relevantSeries.map((s) => s.id));
      const filteredMatches = valorantMatches.filter((m) => relevantSeriesIds.has(m.series_id));
      const relevantMatchIds = new Set(filteredMatches.map((m) => m.id));

      const filteredPlayers = valoPlayers.filter((player) =>
        player.league_schedules?.some((schedule) =>
          filteredScheduleIds.has(schedule.league_schedule_id!)
        )
      );

      const filteredPlayerIds = new Set(filteredPlayers.map((player) => player.id));

      setFilteredValoMatchRecords(() => {
        const updatedRecords: Record<string, ValorantMatchesPlayerStats[] | null> = {};

        Object.keys(valoPlayerMatchRecord).forEach((playerId) => {
          if (filteredPlayerIds.has(playerId)) {
            const playerStats = valoPlayerMatchRecord[playerId];

            if (playerStats) {
              updatedRecords[playerId] = playerStats.filter((match) =>
                relevantMatchIds.has(match.match_id)
              );
            }
          }
        });

        return updatedRecords;
      });
    }
  };

  useEffect(() => {
    let allPlayerStats: ValorantCompiledStats[] = [];

    valoPlayers.forEach((p) => {
      const data = filteredValoMatchRecords[p.id];
      if (data) {
        const stats = processValorantStats(data, valorantMatches, p, characters);
        allPlayerStats.push(stats);
      }
    });

    setValorantData(
      allPlayerStats.sort((a, b) => a.player.ingame_name.localeCompare(b.player.ingame_name))
    );
  }, [filteredValoMatchRecords]);

  useEffect(() => {
    let allPlayerStats: MlbbCompiledStats[] = [];

    mlbbPlayers.forEach((p) => {
      const data = filteredMlbbMatchRecords[p.id];
      if (data) {
        const stats = processMlbbStats(data, p, characters);
        allPlayerStats.push(stats);
      }
    });

    setMlbbData(
      allPlayerStats.sort((a, b) => a.player.ingame_name.localeCompare(b.player.ingame_name))
    );
  }, [filteredMlbbMatchRecords]);

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortData = (column: string) => {
    column = column.toLowerCase();
    setSortColumn(column);

    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);

    const compare = (a: any, b: any) => {
      if (a[column] < b[column]) return newSortOrder === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return newSortOrder === 'asc' ? 1 : -1;
      return 0;
    };

    if (filterPlatform.platform_abbrev === 'MLBB') {
      switch (column) {
        case 'player':
          setMlbbData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc'
                ? a.player.ingame_name.localeCompare(b.player.ingame_name)
                : b.player.ingame_name.localeCompare(a.player.ingame_name)
            )
          );
          break;
        case 'gms':
          setMlbbData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? a.games - b.games : b.games - a.games
            )
          );
          break;
        case 'mvps':
          setMlbbData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? a.mvps - b.mvps : b.mvps - a.mvps
            )
          );
          break;
        case 'r':
          setMlbbData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? Number(a.r) - Number(b.r) : Number(b.r) - Number(a.r)
            )
          );
          break;
        case 'kpg':
          setMlbbData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? Number(a.kpg) - Number(b.kpg) : Number(b.kpg) - Number(a.kpg)
            )
          );
          break;
        case 'dpg':
          setMlbbData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? Number(a.dpg) - Number(b.dpg) : Number(b.dpg) - Number(a.dpg)
            )
          );
          break;
        case 'apg':
          setMlbbData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? Number(a.apg) - Number(b.apg) : Number(b.apg) - Number(a.apg)
            )
          );
          break;
        case 'gld':
          setMlbbData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? a.gld - b.gld : b.gld - a.gld
            )
          );
          break;
        case 'hdmg':
          setMlbbData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? a.hdmg - b.hdmg : b.hdmg - a.hdmg
            )
          );
          break;
        case 'tdmg':
          setMlbbData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? a.tdmg - b.tdmg : b.tdmg - a.tdmg
            )
          );
          break;
        case 'dmgt':
          setMlbbData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? a.dmgt - b.dmgt : b.dmgt - a.dmgt
            )
          );
          break;
        case 'tf':
          setMlbbData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? Number(a.tf) - Number(b.tf) : Number(b.tf) - Number(a.tf)
            )
          );
          break;
        case 'k':
          setMlbbData((prevData) =>
            [...(prevData || [])].sort((a, b) => (newSortOrder === 'asc' ? a.k - b.k : b.k - a.k))
          );
          break;
        case 'd':
          setMlbbData((prevData) =>
            [...(prevData || [])].sort((a, b) => (newSortOrder === 'asc' ? a.d - b.d : b.d - a.d))
          );
          break;
        case 'a':
          setMlbbData((prevData) =>
            [...(prevData || [])].sort((a, b) => (newSortOrder === 'asc' ? a.a - b.a : b.a - a.a))
          );
          break;
        case 'ls':
          setMlbbData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? a.ls - b.ls : b.ls - a.ls
            )
          );
          break;
        case 'ts':
          setMlbbData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? a.ts - b.ts : b.ts - a.ts
            )
          );
          break;
        default:
          setMlbbData((prevData) => [...(prevData || [])].sort(compare));
      }
    } else {
      switch (column) {
        case 'player':
          setValorantData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc'
                ? a.player.ingame_name.localeCompare(b.player.ingame_name)
                : b.player.ingame_name.localeCompare(a.player.ingame_name)
            )
          );
          break;
        case 'agent':
          setValorantData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc'
                ? a.agent.localeCompare(b.agent)
                : b.agent.localeCompare(a.agent)
            )
          );
          break;
        case 'gms':
          setValorantData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? a.games - b.games : b.games - a.games
            )
          );
          break;
        case 'rnds':
          setValorantData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? a.rounds - b.rounds : b.rounds - a.rounds
            )
          );
          break;
        case 'mvps':
          setValorantData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? a.mvps - b.mvps : b.mvps - a.mvps
            )
          );
          break;
        case 'acs':
          setValorantData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? Number(a.acs) - Number(b.acs) : Number(b.acs) - Number(a.acs)
            )
          );
          break;
        case 'kpg':
          setValorantData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? Number(a.kpg) - Number(b.kpg) : Number(b.kpg) - Number(a.kpg)
            )
          );
          break;
        case 'dpg':
          setValorantData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? Number(a.dpg) - Number(b.dpg) : Number(b.dpg) - Number(a.dpg)
            )
          );
          break;
        case 'apg':
          setValorantData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? Number(a.apg) - Number(b.apg) : Number(b.apg) - Number(a.apg)
            )
          );
          break;
        case 'kpr':
          setValorantData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? Number(a.kpr) - Number(b.kpr) : Number(b.kpr) - Number(a.kpr)
            )
          );
          break;
        case 'dpr':
          setValorantData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? Number(a.dpr) - Number(b.dpr) : Number(b.dpr) - Number(a.dpr)
            )
          );
          break;
        case 'apr':
          setValorantData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? Number(a.apr) - Number(b.apr) : Number(b.apr) - Number(a.apr)
            )
          );
          break;
        case 'k':
          setValorantData((prevData) =>
            [...(prevData || [])].sort((a, b) => (newSortOrder === 'asc' ? a.k - b.k : b.k - a.k))
          );
          break;
        case 'd':
          setValorantData((prevData) =>
            [...(prevData || [])].sort((a, b) => (newSortOrder === 'asc' ? a.d - b.d : b.d - a.d))
          );
          break;
        case 'a':
          setValorantData((prevData) =>
            [...(prevData || [])].sort((a, b) => (newSortOrder === 'asc' ? a.a - b.a : b.a - a.a))
          );
          break;
        case 'fb':
          setValorantData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? a.fb - b.fb : b.fb - a.fb
            )
          );
          break;
        case 'pl':
          setValorantData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? a.pl - b.pl : b.pl - a.pl
            )
          );
          break;
        case 'df':
          setValorantData((prevData) =>
            [...(prevData || [])].sort((a, b) =>
              newSortOrder === 'asc' ? a.df - b.df : b.df - a.df
            )
          );
          break;

        default:
          setValorantData((prevData) => [...(prevData || [])].sort(compare));
      }
    }
  };

  return (
    <>
      <aside className="mx-auto border-2 shadow-md dark:border-neutral-900">
        <div className="p-8">
          <div className="flex flex-col gap-6 md:flex-row xl:justify-between">
            {/* Game Dropdown */}
            <div className="flex gap-8">
              <div className="flex flex-col gap-2">
                <span className="px-2 text-sm font-semibold uppercase text-neutral-600 dark:text-neutral-300">
                  Game
                </span>
                <Dropdown value={filterPlatform.platform_abbrev} image={filterPlatform.logo_url}>
                  {platforms.map((platform, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => setFilterPlatform(platform)}
                      selected={platform.id === filterPlatform.id}
                    >
                      <div className="flex items-center justify-between gap-12">
                        <p className="break-words text-xs">{platform.platform_title}</p>
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
              </div>
              <div className="flex min-w-48 flex-col gap-2">
                <span className="px-2 text-sm font-semibold uppercase text-neutral-600 dark:text-neutral-300">
                  Team
                </span>
                <Dropdown
                  value={filterTeam.school_abbrev === 'TBD' ? 'ALL' : filterTeam.school_abbrev}
                  image={filterTeam.logo_url}
                >
                  {teams.map((team, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => setFilterTeam(team)}
                      selected={team.id === filterTeam.id}
                    >
                      <div className="flex items-center justify-between gap-12">
                        <p className="break-words text-xs">
                          {team.school_abbrev === 'TBD' ? 'ALL' : team.school_abbrev}
                        </p>
                        <Image
                          src={team.logo_url}
                          className="h-auto w-4"
                          width={128}
                          height={128}
                          alt={`${team.school_abbrev} Logo`}
                        />
                      </div>
                    </DropdownItem>
                  ))}
                </Dropdown>
              </div>
            </div>

            <div className="flex flex-col gap-8 sm:flex-row">
              {/* Season Type Dropdown */}
              <div className="flex min-w-40 flex-col gap-2">
                <span className="px-2 text-sm font-semibold uppercase text-neutral-600 dark:text-neutral-300">
                  Season Type
                </span>
                <Dropdown value={filterSeasonType || 'All'}>
                  {seasonTypes.map((type, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => {
                        setFilterSeasonType(type === 'All' ? null : type);
                        setFilterSeasonNumber(null);
                        setFilterLeagueStage(null);
                      }}
                      selected={
                        type === filterSeasonType || (filterSeasonType === null && type === 'All')
                      }
                    >
                      <p className="text-xs">{type}</p>
                    </DropdownItem>
                  ))}
                </Dropdown>
              </div>

              {/* Season Number Dropdown */}
              <div className="flex min-w-32 flex-col gap-2">
                <span className="px-2 text-sm font-semibold uppercase text-neutral-600 dark:text-neutral-300">
                  Season No.
                </span>
                <Dropdown
                  value={filterSeasonNumber?.toLocaleString() || 'All'}
                  disabled={!filterSeasonType}
                >
                  {filteredSeasonNumbers.map((num, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => {
                        setFilterSeasonNumber(num === 'All' ? null : num.toString());
                        setFilterLeagueStage(null);
                      }}
                      selected={
                        num === filterSeasonNumber || (filterSeasonNumber === null && num === 'All')
                      }
                    >
                      <p className="text-xs">{num}</p>
                    </DropdownItem>
                  ))}
                </Dropdown>
              </div>

              {/* League Stage Dropdown */}
              <div className="flex min-w-52 flex-col gap-2">
                <span className="px-2 text-sm font-semibold uppercase text-neutral-600 dark:text-neutral-300">
                  League Stage
                </span>
                <Dropdown value={filterLeagueStage || 'All'} disabled={!filterSeasonNumber}>
                  {filteredLeagueStages.map((stage, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => setFilterLeagueStage(stage === 'All' ? null : stage)}
                      selected={
                        stage === filterLeagueStage ||
                        (filterLeagueStage === null && stage === 'All')
                      }
                    >
                      <p className="text-xs">{stage}</p>
                    </DropdownItem>
                  ))}
                </Dropdown>
              </div>
            </div>
          </div>

          <div className="ml-auto w-fit pt-12">
            <button
              type="button"
              onClick={applyLeagueFilter}
              className="rounded-sm bg-yale px-6 py-3 text-sm font-semibold text-antiflash shadow-sm transition-all duration-300 ease-in-out hover:bg-marine"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </aside>

      <main className="no-scrollbar min-h-[90vh] overflow-x-auto pt-16">
        {(filterPlatform.platform_abbrev === 'MLBB' && !mlbbData) ||
        (filterPlatform.platform_abbrev === 'VALO' && !valorantData) ? (
          <Loading />
        ) : (
          <table className="min-w-full table-auto shadow-sm">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <td
                    key={index}
                    className="border bg-neutral-50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-800"
                    title={header.alt}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold">{header.name}</span>
                      {header.name !== 'HERO' && header.name !== 'AGENT' ? (
                        <button onClick={() => sortData(header.name)}>
                          <ArrowsUpDownIcon
                            className={`h-auto w-4 text-foreground ${sortColumn === header.name ? (sortOrder === 'asc' ? 'rotate-180' : '') : ''}`}
                          />
                        </button>
                      ) : null}
                    </div>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {filterPlatform.platform_abbrev === 'MLBB'
                ? filteredMlbbData?.map((stats, index) => (
                    <tr key={index} className="border-b text-xs dark:border-neutral-700 md:text-sm">
                      <td className="flex gap-4 px-4 py-2">
                        <Image
                          src={teams.find((t) => t.id === stats.player.team_id)?.logo_url!}
                          alt="Team Logo"
                          width={32}
                          height={32}
                          className="h-8 w-8"
                        />
                        <div className="flex flex-col">
                          <span className="w-60 text-wrap font-semibold lg:w-fit">
                            {stats.player.ingame_name}
                          </span>
                          <span className="text-xs text-neutral-400">
                            {teams.find((t) => t.id === stats.player.team_id)?.school_abbrev!}
                            &nbsp;
                            {stats.player.last_name}
                          </span>
                        </div>
                      </td>
                      <td className="border px-4 dark:border-neutral-700">{stats.hero}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.games}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.mvps}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.r}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.kpg}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.dpg}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.apg}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.gld}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.hdmg}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.tdmg}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.dmgt}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.tf}%</td>
                      <td className="border text-center dark:border-neutral-700">{stats.k}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.d}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.a}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.ls}</td>

                      <td className="border-l text-center dark:border-neutral-700">{stats.ts}</td>
                    </tr>
                  ))
                : filteredValorantData?.map((stats, index) => (
                    <tr key={index} className="border-b text-sm dark:border-neutral-700">
                      <td className="flex gap-4 px-4 py-2">
                        <Image
                          src={teams.find((t) => t.id === stats.player.team_id)?.logo_url!}
                          alt="Team Logo"
                          width={32}
                          height={32}
                          className="h-8 w-8"
                        />
                        <div className="flex flex-col">
                          <span className="w-60 text-wrap font-semibold lg:w-fit">
                            {stats.player.ingame_name}
                          </span>
                          <span className="text-xs text-neutral-400">
                            {teams.find((t) => t.id === stats.player.team_id)?.school_abbrev!}{' '}
                            &nbsp;
                            {stats.player.last_name}
                          </span>
                        </div>
                      </td>
                      <td className="border px-4 dark:border-neutral-700">{stats.agent}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.games}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.rounds}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.mvps}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.acs}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.kpg}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.dpg}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.apg}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.kpr}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.dpr}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.apr}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.k}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.d}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.a}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.fb}</td>
                      <td className="border text-center dark:border-neutral-700">{stats.pl}</td>
                      <td className="border-l text-center dark:border-neutral-700">{stats.df}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
}
