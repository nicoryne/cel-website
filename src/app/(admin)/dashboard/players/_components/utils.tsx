import { ModalProps } from '@/components/ui/modal';
import {
  GamePlatform,
  LeagueSchedule,
  Player,
  PlayerFormType,
  PlayerWithDetails,
  Team
} from '@/lib/types';
import React from 'react';
import PlayerForm from '@/app/(admin)/dashboard/players/_components/form';
import { deleteFile } from '@/api/utils/storage';
import { callModalTemplate } from '@/app/(admin)/dashboard/utils';
import {
  appendPlayerDetails,
  createPlayer,
  deletePlayerById,
  doesPlayerExist,
  getPlayerByName,
  updatePlayerById
} from '@/api/player';

export const sortBySchoolPlayerName = (a: PlayerWithDetails, b: PlayerWithDetails): number => {
  if (a.team?.id && b.team?.id && a.team.id !== b.team.id) {
    if (a.team.id < b.team.id) return -1;
    if (a.team.id > b.team.id) return 1;
  }

  if (a.platform?.id && b.platform?.id && a.platform.id !== b.platform.id) {
    if (a.platform.id < b.platform.id) return 1;
    if (a.platform.id > b.platform.id) return -1;
  }

  if (a.ingame_name.toLowerCase() < b.ingame_name.toLowerCase()) return -1;
  if (a.ingame_name.toLowerCase() > b.ingame_name.toLowerCase()) return 1;

  return 0;
};

export const fetchPlayersByStringFilter = async (
  searchFilter: string,
  platforms: GamePlatform[],
  teams: Team[]
) => {
  const player = await getPlayerByName(searchFilter);

  if (player) {
    const playerWithDetails = appendPlayerDetails(platforms, teams, player);
    return playerWithDetails;
  }

  return null;
};

export const getFilteredPlayers = (cachedPlayers: PlayerWithDetails[], searchFilter: string) => {
  if (!searchFilter) return cachedPlayers;

  const lowerCaseFilter = searchFilter.toLowerCase();

  return cachedPlayers.filter((player) =>
    [player.ingame_name, player.first_name, player.last_name].some((field) =>
      field.toLowerCase().includes(lowerCaseFilter)
    )
  );
};

export const addPlayerToCache = (
  player: PlayerWithDetails,
  setCachedPlayers: React.Dispatch<React.SetStateAction<PlayerWithDetails[]>>
) => {
  setCachedPlayers((prev) => {
    const exists = prev.some((cachedPlayer) => cachedPlayer.id === player.id);

    if (exists) return prev;

    const updated = [...prev, player];
    return updated.sort(sortBySchoolPlayerName);
  });
};

export const deletePlayerFromCache = (
  player: PlayerWithDetails,
  setCachedPlayers: React.Dispatch<React.SetStateAction<PlayerWithDetails[]>>
) => {
  setCachedPlayers((prev) => {
    const exists = prev.some((cachedPlayer) => cachedPlayer.id === player.id);

    if (!exists) return prev;

    const updated = prev.filter((cachedPlayer) => cachedPlayer.id !== player.id);
    return updated.sort(sortBySchoolPlayerName);
  });
};

export const updatePlayerFromCache = (
  player: PlayerWithDetails,
  setCachedPlayers: React.Dispatch<React.SetStateAction<PlayerWithDetails[]>>
) => {
  setCachedPlayers((prev) => {
    const exists = prev.some((cachedPlayer) => cachedPlayer.id === player.id);

    if (!exists) return prev;

    const updated = prev.map((cachedPlayer) =>
      cachedPlayer.id === player.id ? player : cachedPlayer
    );

    return updated.sort(sortBySchoolPlayerName);
  });
};

export const handleInsert = async (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  formData: React.MutableRefObject<PlayerFormType | undefined>,
  setCachedPlayers: React.Dispatch<React.SetStateAction<PlayerWithDetails[]>>,
  platformList: GamePlatform[],
  teamList: Team[],
  leagueSchedules: Record<string, LeagueSchedule[]>
) => {
  const processedTeamList = teamList.filter((team) => team.school_abbrev !== 'TBD');

  const addNewPlayer = async () => {
    try {
      const firstName = formData.current?.first_name;
      const lastName = formData.current?.last_name;

      if (!firstName || !lastName) {
        setModalProps(callModalTemplate('Player', 'error', 'add', setModalProps));
        return;
      }

      const playerExists: boolean = await doesPlayerExist(firstName, lastName);

      if (playerExists) {
        setModalProps(callModalTemplate('Player', 'exists', 'exists', setModalProps));
        return;
      }
      const createdPlayer: Player | null = await createPlayer(formData.current as PlayerFormType);
      const processedPlayer: PlayerWithDetails = appendPlayerDetails(
        platformList,
        teamList,
        createdPlayer as Player
      );
      setModalProps(callModalTemplate('Player', 'success', 'add', setModalProps));
      setTimeout(() => {
        addPlayerToCache(processedPlayer, setCachedPlayers);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(callModalTemplate('Player', 'error', 'add', setModalProps));
    }
  };

  const props: ModalProps = {
    title: 'Adding New Game Player',
    type: 'info',
    message: 'Fill out the details to add a new game Game Player.',
    onCancel: () => setModalProps(null),
    onConfirm: async () => {
      await addNewPlayer();
    },
    children: (
      <PlayerForm
        formData={formData}
        player={null}
        platformList={platformList}
        teamList={processedTeamList}
        leagueSchedules={leagueSchedules}
      />
    )
  };

  setModalProps(props);
};

export const handleDelete = (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  player: PlayerWithDetails,
  setCachedPlayers: React.Dispatch<React.SetStateAction<PlayerWithDetails[]>>
) => {
  const deletePlayer = async (player: PlayerWithDetails) => {
    try {
      await deletePlayerById(player.id as string);

      setModalProps(callModalTemplate('Player', 'success', 'delete', setModalProps));

      setTimeout(() => {
        deletePlayerFromCache(player, setCachedPlayers);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(callModalTemplate('Player', 'error', 'delete', setModalProps));
    }
  };

  const props: ModalProps = {
    title: 'Deleting Player',
    type: 'warning',
    message: `Are you sure you want to delete Player?`,
    onCancel: () => setModalProps(null),
    onConfirm: async () => {
      await deletePlayer(player);
    }
  };

  setModalProps(props);
};

export const handleUpdate = async (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  formData: React.MutableRefObject<PlayerFormType | undefined>,
  player: PlayerWithDetails,
  setCachedPlayers: React.Dispatch<React.SetStateAction<PlayerWithDetails[]>>,
  platformList: GamePlatform[],
  teamList: Team[],
  leagueSchedules: Record<string, LeagueSchedule[]>
) => {
  const processedTeamList = teamList.filter((team) => team.school_abbrev !== 'TBD');

  const updateExistingPlayer = async () => {
    try {
      const updatedPlayer: Player | null = await updatePlayerById(
        player.id,
        formData.current as PlayerFormType
      );

      const processedPlayer: PlayerWithDetails = appendPlayerDetails(
        platformList,
        teamList,
        updatedPlayer as Player
      );

      setModalProps(callModalTemplate('Player', 'success', 'update', setModalProps));

      setTimeout(() => {
        if (player.picture_url) {
          const url = new URL(player.picture_url);
          const fileName = url.pathname.replace('/storage/v1/object/sign/images/', '');
          deleteFile('images', [fileName]);
        }

        if (formData.current?.league_schedules) {
          processedPlayer.league_schedules = formData.current.league_schedules.map((id) => ({
            league_schedule_id: id
          }));
        }

        updatePlayerFromCache(processedPlayer, setCachedPlayers);

        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(callModalTemplate('Player', 'error', 'update', setModalProps));
    }
  };

  const props: ModalProps = {
    title: 'Updating Player',
    type: 'info',
    message: 'Fill out the details to update player.',
    onCancel: () => setModalProps(null),
    onConfirm: async () => {
      await updateExistingPlayer();
    },
    children: (
      <PlayerForm
        formData={formData}
        player={player}
        platformList={platformList}
        teamList={processedTeamList}
        leagueSchedules={leagueSchedules}
      />
    )
  };

  setModalProps(props);
};
