import {
  createGamePlatform,
  deleteGamePlatformById,
  updateGamePlatformById
} from '@/services/game-platform';
import { ModalProps } from '@/components/ui/modal';
import { GamePlatform, GamePlatformFormType } from '@/lib/types';
import React from 'react';
import GamePlatformForm from '@/app/(admin)/dashboard/platforms/_components/form';
import { deleteFile } from '@/services/utils/storage';
import { callModalTemplate } from '@/app/(admin)/dashboard/utils';

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

    const updated = prev.map((cachedPlatform) =>
      cachedPlatform.id === platform.id ? platform : cachedPlatform
    );

    return updated.sort(sortByName);
  });
};

export const handleInsert = async (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  formData: React.MutableRefObject<GamePlatformFormType | undefined>,
  setCachedPlatforms: React.Dispatch<React.SetStateAction<GamePlatform[]>>
) => {
  const addNewPlatform = async () => {
    try {
      const createdPlatform: GamePlatform | null = await createGamePlatform(
        formData.current as GamePlatformFormType
      );

      setModalProps(callModalTemplate('Game Platform', 'success', 'add', setModalProps));
      setTimeout(() => {
        addPlatformToCache(createdPlatform as GamePlatform, setCachedPlatforms);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(callModalTemplate('Game Platform', 'error', 'add', setModalProps));
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
    try {
      await deleteGamePlatformById(platform.id as string);

      setModalProps(callModalTemplate('Game Platform', 'success', 'delete', setModalProps));

      setTimeout(() => {
        deletePlatformFromCache(platform, setCachedPlatforms);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(callModalTemplate('Game Platform', 'error', 'add', setModalProps));
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
    try {
      const updatedPlatform = await updateGamePlatformById(
        platform.id,
        formData.current as GamePlatformFormType
      );

      setModalProps(callModalTemplate('Game Platform', 'success', 'update', setModalProps));

      setTimeout(() => {
        if (platform.logo_url) {
          const url = new URL(platform.logo_url);
          const fileName = url.pathname.replace('/storage/v1/object/sign/images/', '');
          deleteFile('images', [fileName]);
        }
        updatePlatformFromCache(updatedPlatform as GamePlatform, setCachedPlatforms);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(callModalTemplate('Game Platform', 'error', 'update', setModalProps));
    }
  };

  const props: ModalProps = {
    title: 'Updating Game Platform',
    type: 'info',
    message: 'Fill out the details to update game platform.',
    onCancel: () => setModalProps(null),
    onConfirm: async () => {
      await updateExistingPlatform();
    },
    children: <GamePlatformForm formData={formData} platform={platform} />
  };

  setModalProps(props);
};
