'use client';

import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import { preprocessImageAndExtractRows } from '@/app/(admin)/dashboard/add-match/valorant/_components/utils';
import {
  Character,
  Player,
  Team,
  ValorantMatchesPlayerStatsWithDetails,
  ValorantMatchWithDetails
} from '@/lib/types';
import {
  getPlayerByTeamAndName,
  getPlayersByTeam,
  getPlayersByTeamAndPlatform
} from '@/api/player'; // Assume this API exists
import PlayerStatsTable from '@/app/(admin)/dashboard/add-match/valorant/_components/validate-statistics/table';
import { getCharactersByGamePlatform } from '@/api/characters';
import { createValorantMatch } from '@/api/valorant-match';
import { createValorantMatchPlayerStat } from '@/api/valorant-match-player-stat';
import { useRouter } from 'next/navigation';

type ValidatePlayerStatisticsProps = {
  imageData: React.MutableRefObject<string | undefined>;
  teamsList: Team[];
  valorantPlatformId: string;
  matchInfo: Partial<ValorantMatchWithDetails>;
};

type RowData = {
  image: string;
  text: string;
};

export default function ValidatePlayerStatisticsPanel({
  imageData,
  teamsList,
  valorantPlatformId,
  matchInfo
}: ValidatePlayerStatisticsProps) {
  const [rowsData, setRowsData] = useState<RowData[]>([]);
  const [playingTeams, setPlayingTeams] = useState<Team[]>([]);
  const [playerStatsList, setPlayerStatsList] = useState<
    Partial<ValorantMatchesPlayerStatsWithDetails>[]
  >([]);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [teamPlayers, setTeamPlayers] = useState<Record<string, Player[] | null>>({});
  const [valorantCharacters, setValorantCharacters] = useState<Character[]>([]);
  const router = useRouter();

  const updatePlayerStats = (
    index: number,
    field: keyof ValorantMatchesPlayerStatsWithDetails,
    value: any
  ) => {
    setPlayerStatsList((prevPlayerStats) => {
      const updatedPlayerStats = [...prevPlayerStats];

      const updatedStats = { ...updatedPlayerStats[index] };

      updatedStats[field] = value;

      updatedPlayerStats[index] = updatedStats;

      return updatedPlayerStats;
    });
  };

  useEffect(() => {
    const teamA = teamsList.find((team) => team.id === matchInfo?.series?.team_a_id);
    const teamB = teamsList.find((team) => team.id === matchInfo?.series?.team_b_id);
    let teams = [];
    if (teamA) {
      teams.push(teamA);
    }

    if (teamB) {
      teams.push(teamB);
    }

    setPlayingTeams(teams);
  }, [matchInfo?.series]);

  useEffect(() => {
    const fetchCharacters = async () => {
      const valorantCharacters = await getCharactersByGamePlatform(valorantPlatformId);

      if (valorantCharacters) {
        setValorantCharacters(
          valorantCharacters.sort((a, b) => {
            return a.name < b.name ? -1 : 1;
          })
        );
      }
    };

    fetchCharacters();
  }, []);

  const extractTeam = (data: string) => {
    const matchedTeam = teamsList.find((team) => data.includes(team.school_abbrev));
    return matchedTeam || null;
  };

  const extractPlayer = async (data: string, team: Team) => {
    const playerName = data.replace(team.school_abbrev, '').trim();
    const player = await getPlayerByTeamAndName(team.id, playerName);
    return player;
  };

  const fetchPlayersForTeams = async () => {
    const playersByTeam: Record<string, Player[] | null> = {};
    for (const team of playingTeams) {
      if (valorantPlatformId) {
        const players = await getPlayersByTeamAndPlatform(team.id, valorantPlatformId);
        playersByTeam[team.id] = players;
      } else {
        const players = await getPlayersByTeam(team.id);
        playersByTeam[team.id] = players;
      }
    }
    setTeamPlayers(playersByTeam);
  };

  useEffect(() => {
    if (playingTeams.length > 0) {
      fetchPlayersForTeams();
    }
  }, [playingTeams]);

  const compilePlayerStats = (rows: RowData[]) => {
    const compiledStats: Partial<ValorantMatchesPlayerStatsWithDetails>[] = [];

    for (let i = 0; i < rows.length; i += 9) {
      const chunk = rows.slice(i, i + 9);
      const playerStat: Partial<ValorantMatchesPlayerStatsWithDetails> = {};

      chunk.forEach(async (row, index) => {
        switch (index) {
          case 0:
            const data = row.text;
            const team = extractTeam(data);
            let player = undefined;

            if (team) {
              const found = playingTeams.some((cachedTeam) => cachedTeam.id === team.id);

              if (!found) {
                setPlayingTeams((prev) => [...prev, team]);
              }

              const res = await extractPlayer(data, team);
              player = res || undefined;
            }

            playerStat.player = player;
            break;
          case 1:
            playerStat.acs = parseInt(row.text, 10);
            break;
          case 2:
            playerStat.kills = parseInt(row.text, 10);
            break;
          case 3:
            playerStat.deaths = parseInt(row.text, 10);
            break;
          case 4:
            playerStat.assists = parseInt(row.text, 10);
            break;
          case 5:
            playerStat.econ_rating = parseInt(row.text, 10);
            break;
          case 6:
            playerStat.first_bloods = parseInt(row.text, 10);
            break;
          case 7:
            playerStat.plants = parseInt(row.text, 10);
            break;
          case 8:
            playerStat.defuses = parseInt(row.text, 10);
            break;
          default:
            break;
        }
      });

      compiledStats.push(playerStat);
    }

    setPlayerStatsList(compiledStats);
  };

  useEffect(() => {
    if (imageData.current) {
      const processImageData = async () => {
        try {
          const { rowsData, processedImageUrl } = await processImage(imageData.current!);
          setRowsData(rowsData);
          compilePlayerStats(rowsData);
          setProcessedImage(processedImageUrl);
          setError(null);
        } catch (err) {
          setError('Failed to extract text from image. Please try again.');
          console.error(err);
        }
      };

      processImageData();
    }
  }, [imageData]);

  const processRows = async (rowDataUrls: string[][]) => {
    const results: RowData[] = [];
    const totalCells = rowDataUrls.flat().length;
    let processedCells = 0;

    for (const rowDataUrl of rowDataUrls) {
      const rowResult: RowData[] = [];
      for (const cellDataUrl of rowDataUrl) {
        const {
          data: { text }
        } = await Tesseract.recognize(cellDataUrl, 'eng', {
          logger: (info) => {
            if (info.status === 'recognizing text') {
              const cellProgress = info.progress / totalCells;
              setProgress((prevProgress) =>
                Math.min(100, prevProgress + Math.round(cellProgress * 100))
              );
            }
          }
        });
        rowResult.push({ image: cellDataUrl, text });

        processedCells += 1;
        setProgress(Math.round((processedCells / totalCells) * 100));
      }
      results.push(...rowResult);
    }
    return results;
  };

  const processImage = async (imagePath: string) => {
    try {
      const { rowDataUrls, processedImageUrl } = await preprocessImageAndExtractRows(imagePath);
      const rowResults = await processRows(rowDataUrls);
      return { rowsData: rowResults, processedImageUrl };
    } catch (err) {
      console.error('Error processing image:', err);
      throw err;
    }
  };

  const handleStatsSubmit = async () => {
    try {
      const processedMatchInfo = {
        series_id: matchInfo.series?.id,
        map_id: matchInfo.map?.id,
        match_duration: matchInfo.match_duration,
        match_number: matchInfo.match_number,
        team_a_status: matchInfo.team_a_status,
        team_a_rounds: matchInfo.team_a_rounds,
        team_b_status: matchInfo.team_b_status,
        team_b_rounds: matchInfo.team_b_rounds
      };
      const data = await createValorantMatch(processedMatchInfo);
      if (!data) throw new Error('Match creation failed');

      playerStatsList.forEach(async (playerStat) => {
        try {
          const processedStat = {
            player_id: playerStat.player?.id,
            match_id: data?.id,
            agent_id: playerStat.agent?.id,
            acs: playerStat.acs,
            kills: playerStat.kills,
            deaths: playerStat.deaths,
            assists: playerStat.assists,
            econ_rating: playerStat.econ_rating,
            first_bloods: playerStat.first_bloods,
            plants: playerStat.plants,
            defuses: playerStat.defuses,
            is_mvp: playerStat.is_mvp === true ? true : false
          };
          await createValorantMatchPlayerStat(processedStat);
        } catch (error) {
          console.error('Error creating player stat:', error);
        }
      });

      router.push('/dashboard');
    } catch (error) {
      setError('Failed to submit statistics.');
      console.error('Error during submission:', error);
    }
  };

  return (
    <div className="w-full items-center justify-center rounded-md p-4">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          {processedImage && (
            <div>
              <h4 className="text-lg font-semibold text-neutral-200">Processed Image</h4>
              <img
                src={imageData.current}
                alt="Processed Image"
                className="w-full rounded-md border border-neutral-700"
              />
            </div>
          )}
          {teamPlayers && playerStatsList.length > 0 ? (
            <div className="mt-4 flex h-full flex-col gap-4 pb-32 pt-8">
              <PlayerStatsTable
                playerStatsList={playerStatsList}
                onSubmit={handleStatsSubmit}
                availablePlayers={teamPlayers}
                valorantCharacters={valorantCharacters}
                onChange={updatePlayerStats}
              />
              <button
                type="button"
                className="ml-auto w-fit bg-green-800 px-4 py-1"
                onClick={handleStatsSubmit}
              >
                Submit
              </button>
            </div>
          ) : (
            <p className="text-xl">Processing... {progress > 0 && `${progress}%`}</p>
          )}
        </div>
      )}
    </div>
  );
}
