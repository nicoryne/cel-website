import {
  appendCharacterDetails,
  createCharacter,
  deleteCharacterById,
  getCharacterByName,
  getCharactersByIndexRange,
  updateCharacter
} from '@/api/characters';
import { getAllGamePlatforms } from '@/api/game-platform';
import { ModalProps } from '@/components/modal';
import { Character, CharacterWithDetails, GamePlatform } from '@/lib/types';
import CharactersForm from '@/components/admin/clients/characters/form';
import React from 'react';

export const fetchCharactersByIndexRange = async (min: number, max: number) => {
  const list: CharacterWithDetails[] = [];

  const platforms = await getAllGamePlatforms();
  const characters = await getCharactersByIndexRange(min, max);

  characters.map((character) => {
    list.push({
      ...character,
      platform: platforms.find((platform) => platform.id === character.platform_id) as GamePlatform
    });
  });

  return list;
};

export const fetchCharacterByStringFilter = async (searchFilter: string) => {
  const platforms = await getAllGamePlatforms();
  const character = await getCharacterByName(searchFilter);

  if (character) {
    const characterWithDetails = appendCharacterDetails(platforms, character);
    return characterWithDetails;
  }

  return null;
};

export const getFilteredCharacters = (cachedCharacters: CharacterWithDetails[], searchFilter: string) => {
  const filtered = searchFilter
    ? cachedCharacters.filter((character) => character.name.toLowerCase().includes(searchFilter.toLowerCase()))
    : cachedCharacters;

  return filtered;
};

export const sortByPlatformThenName = (a: CharacterWithDetails, b: CharacterWithDetails): number => {
  if (a.platform?.id && b.platform?.id && a.platform.id !== b.platform.id) {
    if (a.platform.id < b.platform.id) return -1;
    if (a.platform.id > b.platform.id) return 1;
  }

  if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
  if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;

  return 0;
};

export const addCharacterToCache = (
  character: CharacterWithDetails,
  setCachedCharacters: React.Dispatch<React.SetStateAction<CharacterWithDetails[]>>
) => {
  setCachedCharacters((prev) => {
    const exists = prev.some((cachedChar) => cachedChar.id === character.id);

    if (exists) return prev;

    const updated = [...prev, character];
    return updated.sort(sortByPlatformThenName);
  });
};

export const deleteCharacterFromCache = (
  character: CharacterWithDetails,
  setCachedCharacters: React.Dispatch<React.SetStateAction<CharacterWithDetails[]>>
) => {
  setCachedCharacters((prev) => {
    const exists = prev.some((cachedChar) => cachedChar.id === character.id);

    if (!exists) return prev;

    const updated = prev.filter((cachedChar) => cachedChar.id !== character.id);
    return updated.sort(sortByPlatformThenName);
  });
};

export const updateCharacterFromCache = (
  character: CharacterWithDetails,
  setCachedCharacters: React.Dispatch<React.SetStateAction<CharacterWithDetails[]>>
) => {
  setCachedCharacters((prev) => {
    const exists = prev.some((cachedChar) => cachedChar.id === character.id);

    if (!exists) return prev;

    const updated = prev.map((cachedChar) => (cachedChar.id === character.id ? character : cachedChar));

    return updated.sort(sortByPlatformThenName);
  });
};

export const handleInsert = async (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  formData: React.MutableRefObject<Partial<Character>>,
  setCachedCharacters: React.Dispatch<React.SetStateAction<CharacterWithDetails[]>>
) => {
  const platforms = await getAllGamePlatforms();

  const addNewCharacter = async () => {
    const successModal: ModalProps = {
      title: 'Success',
      message: 'Character has been successfully added!',
      type: 'success'
    };

    const failedModal: ModalProps = {
      title: 'Error',
      message: 'Failed to add character. Please try again.',
      type: 'error',
      onCancel: () => setModalProps(null)
    };

    try {
      const createdCharacter: Character | null = await createCharacter(formData.current as {});
      setModalProps(successModal);

      setTimeout(() => {
        const characterWithDetails = appendCharacterDetails(platforms, createdCharacter as Character);
        addCharacterToCache(characterWithDetails, setCachedCharacters);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(failedModal);
    }
  };

  const props: ModalProps = {
    title: 'Adding New Character',
    type: 'info',
    message: 'Fill out the details to add a new game character.',
    onCancel: () => setModalProps(null),
    onConfirm: async () => {
      await addNewCharacter();
    },
    children: <CharactersForm platforms={platforms} formData={formData} character={null} />
  };

  setModalProps(props);
};

export const handleDelete = (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  character: CharacterWithDetails,
  setCachedCharacters: React.Dispatch<React.SetStateAction<CharacterWithDetails[]>>
) => {
  const deleteCharacter = async (character: CharacterWithDetails) => {
    const successModal: ModalProps = {
      title: 'Success',
      message: `${character.name} has been successfully deleted.`,
      type: 'success'
    };

    const failedModal: ModalProps = {
      title: 'Error',
      message: `Failed to delete ${character.name}. Please try again.`,
      type: 'error',
      onCancel: () => setModalProps(null)
    };

    try {
      const fullCharacterDetails = await getCharacterByName(character.name);
      await deleteCharacterById(fullCharacterDetails?.id as string);

      setModalProps(successModal);

      setTimeout(() => {
        deleteCharacterFromCache(character, setCachedCharacters);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(failedModal);
    }
  };

  const props: ModalProps = {
    title: 'Deleting Character',
    type: 'warning',
    message: `Are you sure you want to delete ${character.name}?`,
    onCancel: () => setModalProps(null),
    onConfirm: async () => {
      await deleteCharacter(character);
    }
  };

  setModalProps(props);
};

export const handleUpdate = async (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  formData: React.MutableRefObject<Partial<Character>>,
  character: CharacterWithDetails,
  setCachedCharacters: React.Dispatch<React.SetStateAction<CharacterWithDetails[]>>
) => {
  const platforms = await getAllGamePlatforms();

  const updateExistingCharacter = async () => {
    const successModal: ModalProps = {
      title: 'Success',
      message: 'Character has been successfully updated!',
      type: 'success'
    };

    const failedModal: ModalProps = {
      title: 'Error',
      message: 'Failed to update character. Please try again.',
      type: 'error',
      onCancel: () => setModalProps(null)
    };

    try {
      const updatedCharacter = await updateCharacter(character.id as string, formData.current as {});

      setModalProps(successModal);

      setTimeout(() => {
        const updatedCharacterWithDetails = appendCharacterDetails(platforms, updatedCharacter as Character);
        updateCharacterFromCache(updatedCharacterWithDetails, setCachedCharacters);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(failedModal);
    }
  };

  const props: ModalProps = {
    title: 'Updating Character',
    type: 'info',
    message: 'Fill out the details to update game character.',
    onCancel: () => setModalProps(null),
    onConfirm: async () => {
      await updateExistingCharacter();
    },
    children: <CharactersForm platforms={platforms} formData={formData} character={character} />
  };

  setModalProps(props);
};
