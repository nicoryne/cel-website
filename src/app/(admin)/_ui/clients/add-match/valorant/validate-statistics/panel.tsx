'use client';

import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import { preprocessImageAndExtractRows } from '@/app/(admin)/_ui/clients/add-match/valorant/utils';
import { Player, Team, ValorantMatchesPlayerStats, ValorantMatchesPlayerStatsWithDetails } from '@/lib/types';
import { getPlayerByTeamAndName, getPlayersByTeam, getPlayersByTeamAndPlatform } from '@/api/player'; // Assume this API exists
import PlayerStatsTable from '@/app/(admin)/_ui/clients/add-match/valorant/validate-statistics/table';

type ValidatePlayerStatisticsProps = {
  imageData: React.MutableRefObject<string | undefined>;
  teamsList: Team[];
  valorantPlatformId: string;
};

type RowData = {
  image: string;
  text: string;
};

export default function ValidatePlayerStatisticsPanel({
  imageData,
  teamsList,
  valorantPlatformId
}: ValidatePlayerStatisticsProps) {
  const [rowsData, setRowsData] = useState<RowData[]>([]);
  const [playingTeams, setPlayingTeams] = useState<Team[]>([]);
  const [playerStatsList, setPlayerStatsList] = useState<Partial<ValorantMatchesPlayerStatsWithDetails>[]>([]);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [teamPlayers, setTeamPlayers] = useState<Record<string, Player[] | null>>({});

  useEffect(() => {
    console.log(playerStatsList);
  }, [playerStatsList]);

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
              setProgress((prevProgress) => Math.min(100, prevProgress + Math.round(cellProgress * 100)));
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

  const handleStatsSubmit = (updatedStats: Partial<ValorantMatchesPlayerStats>[]) => {
    console.log('Updated Stats:', updatedStats);
  };

  return (
    <div className="w-full rounded-md border-2 border-neutral-700 bg-neutral-900 p-4 text-neutral-600">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          {processedImage && (
            <div>
              <h2 className="text-lg font-semibold text-neutral-200">Processed Image</h2>
              <img src={processedImage} alt="Processed Image" className="w-full rounded-md border border-neutral-700" />
            </div>
          )}
          {teamPlayers && playerStatsList.length > 0 ? (
            <div className="mt-4">
              <PlayerStatsTable
                playerStatsList={playerStatsList}
                onSubmit={handleStatsSubmit}
                availablePlayers={teamPlayers}
              />
            </div>
          ) : (
            <p>Processing... {progress > 0 && `${progress}%`}</p>
          )}
        </div>
      )}
    </div>
  );
}
