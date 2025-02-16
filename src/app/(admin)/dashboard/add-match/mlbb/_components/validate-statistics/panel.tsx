'use client';

import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import { preprocessImageAndExtractRows } from '@/app/(admin)/dashboard/add-match/mlbb/_components/utils';
import {
  Character,
  GamePlatform,
  LeagueSchedule,
  MlbbMatch,
  MlbbMatchesPlayerStatsWithDetails,
  MlbbMatchWithDetails,
  Player,
  SeriesFormType,
  Team
} from '@/lib/types';
import { getPlayersByTeamAndPlatform } from '@/api/player';
import PlayerStatsTable from '@/app/(admin)/dashboard/add-match/mlbb/_components/validate-statistics/table';
import { getCharactersByGamePlatform } from '@/api/characters';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createMlbbMatch } from '@/api/mlbb-match';
import { createMlbbMatchPlayerStat } from '@/api/mlbb-match-player-stat';
import { getSeriesById, updateSeriesById } from '@/api/series';
import { getLeagueScheduleById } from '@/api/league-schedule';
import { getGamePlatformById } from '@/api/game-platform';
import { SeriesType } from '@/lib/enums';

type ValidatePlayerStatisticsProps = {
  equipmentImageData: React.MutableRefObject<string | undefined>;
  dataImageData: React.MutableRefObject<string | undefined>;
  teamsList: Team[];
  mlbbPlatformId: string;
  matchInfo: Partial<MlbbMatchWithDetails>;
};

type RowData = {
  image: string;
  text: string;
};

export default function ValidatePlayerStatisticsPanel({
  equipmentImageData,
  dataImageData,
  teamsList,
  mlbbPlatformId,
  matchInfo
}: ValidatePlayerStatisticsProps) {
  const [rowsData, setRowsData] = useState<RowData[]>([]);
  const [playingTeams, setPlayingTeams] = useState<Team[]>([]);
  const [playerStatsList, setPlayerStatsList] = useState<
    Partial<MlbbMatchesPlayerStatsWithDetails>[]
  >([]);
  const [processedImageEquipment, setProcessedImageEquipment] = useState<string | null>(null);
  const [processedImageData, setProcessedImageData] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [mlbbCharacters, setMlbbCharacters] = useState<Character[]>([]);
  const [imagePreview, setImagePreview] = useState<string>(equipmentImageData.current || '');
  const router = useRouter();

  const switchPreviewImage = () => {
    if (imagePreview === equipmentImageData.current || '') {
      setImagePreview(dataImageData?.current || '');
    } else {
      setImagePreview(equipmentImageData?.current || '');
    }
  };

  const updatePlayerStats = (
    index: number,
    field: keyof MlbbMatchesPlayerStatsWithDetails,
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
      const mlbbCharacters = await getCharactersByGamePlatform(mlbbPlatformId);

      if (mlbbCharacters) {
        setMlbbCharacters(
          mlbbCharacters.sort((a, b) => {
            return a.name < b.name ? -1 : 1;
          })
        );
      }
    };

    fetchCharacters();
  }, []);

  const fetchPlayers = async () => {
    const playerPromises = playingTeams.map((team) =>
      getPlayersByTeamAndPlatform(team.id, mlbbPlatformId)
    );

    const playerResults = await Promise.all(playerPromises);
    const flattenedPlayers = playerResults.flat();

    setAvailablePlayers(flattenedPlayers);
  };

  useEffect(() => {
    if (playingTeams.length > 0) {
      fetchPlayers();
    }
  }, [playingTeams]);

  const extractPlayer = (data: string) => {
    return availablePlayers?.find((p) => data.includes(p.ingame_name));
  };

  const compilePlayerStats = (rows: RowData[]) => {
    const ITEMS = 10;
    const compiledStats: Partial<MlbbMatchesPlayerStatsWithDetails>[] = [];
    for (let i = 0; i < rows.length; i += ITEMS) {
      const playerStat: Partial<MlbbMatchesPlayerStatsWithDetails> = {};
      const chunk = rows.slice(i, i + ITEMS);

      chunk.forEach(async (row, index) => {
        switch (index) {
          case 0:
            const data = row.text;

            playerStat.player = extractPlayer(data);
            break;
          case 1:
            playerStat.rating = parseInt(row.text, 10);
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
            playerStat.net_worth = parseInt(row.text, 10);
            break;
          case 6:
            playerStat.hero_dmg = parseInt(row.text, 10);
            break;
          case 7:
            playerStat.turret_dmg = parseInt(row.text, 10);
            break;
          case 8:
            playerStat.dmg_tkn = parseInt(row.text, 10);
            break;
          case 9:
            playerStat.teamfight = parseInt(row.text, 10);
          default:
            break;
        }
      });

      compiledStats.push(playerStat);
    }

    setPlayerStatsList(compiledStats);
  };

  useEffect(() => {
    if (equipmentImageData.current && dataImageData.current) {
      const processImageData = async () => {
        try {
          const { rowsData, processedEquipmentUrl, processedDataUrl } = await processImage(
            equipmentImageData.current!,
            dataImageData.current!
          );
          setRowsData(rowsData);
          setProcessedImageEquipment(processedEquipmentUrl);
          setProcessedImageData(processedDataUrl);
          setError(null);
        } catch (err) {
          setError('Failed to extract text from image. Please try again.');
          console.error(err);
        }
      };

      processImageData();
    }
  }, [equipmentImageData && dataImageData]);

  useEffect(() => {
    if (availablePlayers.length > 0 && rowsData.length > 0) {
      compilePlayerStats(rowsData);
    }
  }, [availablePlayers, rowsData]);

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

  const processImage = async (equipmentImagePath: string, dataImagePath: string) => {
    try {
      const { rowDataUrls, processedEquipmentUrl, processedDataUrl } =
        await preprocessImageAndExtractRows(equipmentImagePath, dataImagePath);
      const rowResults = await processRows(rowDataUrls);
      return { rowsData: rowResults, processedEquipmentUrl, processedDataUrl };
    } catch (err) {
      console.error('Error processing image:', err);
      throw err;
    }
  };

  const updateSeries = async (series_id: string, matchUpdates: MlbbMatch) => {
    try {
      const series = await getSeriesById(series_id);

      if (!series) {
        console.error('Series not found');
        return;
      }

      if (series.status === 'Finished') {
        console.error('Series is already finished');
        return;
      }

      const teamA = playingTeams.find((s) => s.id === series.team_a_id);
      const teamB = playingTeams.find((s) => s.id === series.team_b_id);
      const leagueSchedule = await getLeagueScheduleById(series.league_schedule_id);
      const platform = await getGamePlatformById(series.platform_id);

      if (!teamA || !teamB || !leagueSchedule || !platform) {
        console.error('Series or required data not found');
        return;
      }

      let teamAScore = series.team_a_score;
      let teamBScore = series.team_b_score;

      if (matchUpdates.team_a_status === 'Win') {
        teamAScore++;
      } else if (matchUpdates.team_b_status === 'Win') {
        teamBScore++;
      }

      const requiredWins: Record<string, number> = {
        [SeriesType.BO1]: 1,
        [SeriesType.BO2]: 2,
        [SeriesType.BO3]: 2,
        [SeriesType.BO5]: 3,
        [SeriesType.BO7]: 4
      };

      let teamAStatus = 'Ongoing';
      let teamBStatus = 'Ongoing';
      let seriesStatus = 'Ongoing';

      const winsNeeded = requiredWins[series.series_type];

      if (teamAScore >= winsNeeded) {
        teamAStatus = 'Win';
        teamBStatus = 'Loss';
        seriesStatus = 'Finished';
      } else if (teamBScore >= winsNeeded) {
        teamAStatus = 'Loss';
        teamBStatus = 'Win';
        seriesStatus = 'Finished';
      }

      let updatedSeries: SeriesFormType = {
        league_schedule: leagueSchedule as LeagueSchedule,
        series_type: series.series_type,
        team_a: teamA as Team,
        team_a_score: teamAScore,
        team_a_status: teamAStatus,
        team_b: teamB as Team,
        team_b_score: teamBScore,
        team_b_status: teamBStatus,
        week: series.week,
        status: seriesStatus,
        match_number: series.match_number,
        platform: platform as GamePlatform,
        date: new Date(series.start_time!).toISOString().split('T')[0],
        start_time: new Date(series.start_time!).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        end_time: new Date(series.end_time!).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      await updateSeriesById(series_id, updatedSeries);
      console.log('Series updated successfully:', updatedSeries);
    } catch (error) {
      console.error('Error updating series:', error);
    }
  };

  const handleStatsSubmit = async () => {
    try {
      const processedMatchInfo = {
        series_id: matchInfo.series?.id,
        match_duration: matchInfo.match_duration,
        match_number: matchInfo.match_number,
        team_a_status: matchInfo.team_a_status,
        team_b_status: matchInfo.team_b_status
      };
      console.log(processedMatchInfo);
      const data = await createMlbbMatch(processedMatchInfo);
      if (!data) throw new Error('Match creation failed');

      playerStatsList.forEach(async (playerStat) => {
        try {
          const processedStat = {
            player_id: playerStat.player?.id,
            match_id: data?.id,
            hero_id: playerStat.hero?.id,
            rating: playerStat.rating,
            kills: playerStat.kills,
            deaths: playerStat.deaths,
            assists: playerStat.assists,
            net_worth: playerStat.net_worth,
            hero_dmg: playerStat.hero_dmg,
            turret_dmg: playerStat.turret_dmg,
            dmg_tkn: playerStat.dmg_tkn,
            teamfight: playerStat.teamfight,
            turtle_slain: playerStat.turtle_slain,
            lord_slain: playerStat.lord_slain,
            is_mvp: playerStat.is_mvp === true ? true : false
          };
          await createMlbbMatchPlayerStat(processedStat);
        } catch (error) {
          console.error('Error creating player stat:', error);
        }
      });

      await updateSeries(data.series_id, data);
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
          {processedImageEquipment && processedImageData && (
            <div className="space-y-4">
              <div>
                {equipmentImageData && dataImageData && (
                  <>
                    <h4 className="text-lg font-semibold text-neutral-200">Processed Image</h4>
                    <Image
                      src={imagePreview}
                      alt="Processed Image"
                      className="w-full rounded-md border border-neutral-700"
                      width={1280}
                      height={720}
                    />
                  </>
                )}
              </div>
              <button
                type="button"
                className="rounded-md bg-navy px-4 py-1 transition-colors duration-300 ease-in-out hover:bg-federal active:bg-marine"
                onClick={switchPreviewImage}
              >
                Switch Image
              </button>
            </div>
          )}
          {availablePlayers && playerStatsList.length > 0 ? (
            <div className="mt-4 flex h-full flex-col gap-4 pb-32 pt-8">
              <PlayerStatsTable
                playerStatsList={playerStatsList}
                availablePlayers={availablePlayers}
                mlbbCharacters={mlbbCharacters}
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
