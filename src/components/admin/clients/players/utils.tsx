import {
  createGamePlatform,
  deleteGamePlatform,
  getGamePlatformById,
  getGamePlatformsByIndexRange,
  updateGamePlatform
} from '@/api/game-platform';
import { ModalProps } from '@/components/modal';
import { GamePlatform, GamePlatformFormType, PlayerWithDetails } from '@/lib/types';
import React from 'react';
import GamePlatformForm from '@/components/admin/clients/platforms/form';
import { deleteFile } from '@/api/utils/storage';

export const sortBySchoolPlatformName = (a: PlayerWithDetails, b: PlayerWithDetails): number => {
  if (a.team?.id && b.team?.id && a.team.id !== b.team.id) {
    if (a.team.id < b.team.id) return -1;
    if (a.team.id > b.team.id) return 1;
  }

  if (a.platform?.id && b.platform?.id && a.platform.id !== b.platform.id) {
    if (a.platform.id < b.platform.id) return -1;
    if (a.platform.id > b.platform.id) return 1;
  }

  if (a.ingame_name.toLowerCase() < b.ingame_name.toLowerCase()) return -1;
  if (a.ingame_name.toLowerCase() > b.ingame_name.toLowerCase()) return 1;

  return 0;
};

export const addPlayerToCache = (
  player: PlayerWithDetails,
  setCachedPlayers: React.Dispatch<React.SetStateAction<PlayerWithDetails[]>>
) => {
  setCachedPlayers((prev) => {
    const exists = prev.some((cachedPlayer) => cachedPlayer.id === player.id);

    if (exists) return prev;

    const updated = [...prev, player];
    return updated.sort(sortBySchoolPlatformName);
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
    return updated.sort(sortBySchoolPlatformName);
  });
};

export const updatePlayerFromCache = (
  player: PlayerWithDetails,
  setCachedPlatforms: React.Dispatch<React.SetStateAction<PlayerWithDetails[]>>
) => {
  setCachedPlatforms((prev) => {
    const exists = prev.some((cachedPlayer) => cachedPlayer.id === player.id);

    if (!exists) return prev;

    const updated = prev.map((cachedPlayer) => (cachedPlayer.id === player.id ? player : cachedPlayer));

    return updated.sort(sortBySchoolPlatformName);
  });
};

export const handleInsert = async (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  formData: React.MutableRefObject<GamePlatformFormType | undefined>,
  setCachedPlayers: React.Dispatch<React.SetStateAction<PlayerWithDetails[]>>
) => {
  const addNewPlatform = async () => {
    const successModal: ModalProps = {
      title: 'Success',
      message: 'Schedule has been successfully added!',
      type: 'success'
    };

    const failedModal: ModalProps = {
      title: 'Error',
      message: 'Failed to add Schedule. Please try again.',
      type: 'error',
      onCancel: () => setModalProps(null)
    };

    try {
      const createdPlatform: GamePlatform | null = await createGamePlatform(formData.current as GamePlatformFormType);

      setModalProps(successModal);
      setTimeout(() => {
        addPlatformToCache(createdPlatform as GamePlatform, setCachedPlatforms);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(failedModal);
    }
  };

  const props: ModalProps = {
    title: 'Adding New Game Platform',
    type: 'info',
    message: 'Fill out the details to add a new game Game Platform.',
    onCancel: () => setModalProps(null),
    onConfirm: async () => {
      await addNewPlatform();
    },
    children: <GamePlatformForm formData={formData} platform={null} />
  };

  setModalProps(props);
};

export const handleDelete = (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  platform: GamePlatform,
  setCachedPlatforms: React.Dispatch<React.SetStateAction<GamePlatform[]>>
) => {
  const deletePlatform = async (schedule: GamePlatform) => {
    const successModal: ModalProps = {
      title: 'Success',
      message: `Game Platform has been successfully deleted.`,
      type: 'success'
    };

    const failedModal: ModalProps = {
      title: 'Error',
      message: `Failed to delete Game Platform. Please try again.`,
      type: 'error',
      onCancel: () => setModalProps(null)
    };

    try {
      await deleteGamePlatform(platform.id as string);

      setModalProps(successModal);

      setTimeout(() => {
        deletePlatformFromCache(platform, setCachedPlatforms);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(failedModal);
    }
  };

  const props: ModalProps = {
    title: 'Deleting Game Platform',
    type: 'warning',
    message: `Are you sure you want to delete Game Platform?`,
    onCancel: () => setModalProps(null),
    onConfirm: async () => {
      await deletePlatform(platform);
    }
  };

  setModalProps(props);
};

export const handleUpdate = async (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  formData: React.MutableRefObject<GamePlatformFormType | undefined>,
  platform: GamePlatform,
  setCachedPlatforms: React.Dispatch<React.SetStateAction<GamePlatform[]>>
) => {
  const updateExistingPlatform = async () => {
    const successModal: ModalProps = {
      title: 'Success',
      message: 'Game Platform has been successfully updated!',
      type: 'success'
    };

    const failedModal: ModalProps = {
      title: 'Error',
      message: 'Failed to update Game Platform. Please try again.',
      type: 'error',
      onCancel: () => setModalProps(null)
    };

    try {
      const updatedPlatform = await updateGamePlatform(platform.id, formData.current as GamePlatformFormType);

      setModalProps(successModal);

      setTimeout(() => {
        const url = new URL(platform.logo_url);
        const fileName = url.pathname.replace('/storage/v1/object/sign/images/', '');
        deleteFile('images', [fileName]);
        updatePlatformFromCache(updatedPlatform as GamePlatform, setCachedPlatforms);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(failedModal);
    }
  };

  const props: ModalProps = {
    title: 'Updating Schedule',
    type: 'info',
    message: 'Fill out the details to update game Schedule.',
    onCancel: () => setModalProps(null),
    onConfirm: async () => {
      await updateExistingPlatform();
    },
    children: <GamePlatformForm formData={formData} platform={platform} />
  };

  setModalProps(props);
};
