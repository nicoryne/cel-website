import {
  createGamePlatform,
  deleteGamePlatform,
  getGamePlatformById,
  getGamePlatformsByIndexRange,
  updateGamePlatform
} from '@/api/game-platform';
import { ModalProps } from '@/components/modal';
import { GamePlatform, GamePlatformFormType } from '@/lib/types';
import React from 'react';
import GamePlatformForm from '@/components/admin/clients/platforms/form';
import { deleteFile } from '@/api/utils/storage';

export const sortByName = (a: GamePlatform, b: GamePlatform): number => {
  if (a.platform_abbrev < b.platform_abbrev) return -1;
  if (a.platform_abbrev > b.platform_abbrev) return 1;

  return 0;
};

export const addPlatformToCache = (
  platform: GamePlatform,
  setCachedPlatforms: React.Dispatch<React.SetStateAction<GamePlatform[]>>
) => {
  setCachedPlatforms((prev) => {
    const exists = prev.some((cachedPlatform) => cachedPlatform.id === platform.id);

    if (exists) return prev;

    const updated = [...prev, platform];
    return updated.sort(sortByName);
  });
};

export const deletePlatformFromCache = (
  platform: GamePlatform,
  setCachedPlatforms: React.Dispatch<React.SetStateAction<GamePlatform[]>>
) => {
  setCachedPlatforms((prev) => {
    const exists = prev.some((cachedPlatform) => cachedPlatform.id === platform.id);

    if (!exists) return prev;

    const updated = prev.filter((cachedPlatform) => cachedPlatform.id !== platform.id);
    return updated.sort(sortByName);
  });
};

export const updatePlatformFromCache = (
  platform: GamePlatform,
  setCachedPlatforms: React.Dispatch<React.SetStateAction<GamePlatform[]>>
) => {
  setCachedPlatforms((prev) => {
    const exists = prev.some((cachedPlatform) => cachedPlatform.id === platform.id);

    if (!exists) return prev;

    const updated = prev.map((cachedPlatform) => (cachedPlatform.id === platform.id ? platform : cachedPlatform));

    return updated.sort(sortByName);
  });
};

export const handleInsert = async (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  formData: React.MutableRefObject<GamePlatformFormType | undefined>,
  setCachedPlatforms: React.Dispatch<React.SetStateAction<GamePlatform[]>>
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
