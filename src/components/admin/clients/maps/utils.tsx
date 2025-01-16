import { createMap, deleteMapById, updateMapById } from '@/api/maps';
import { ModalProps } from '@/components/modal';
import { ValorantMap, ValorantMapFormType } from '@/lib/types';
import React from 'react';
import ValorantMapForm from '@/components/admin/clients/maps/form';
import { deleteFile } from '@/api/utils/storage';
import { callModalTemplate } from '@/components/admin/clients/utils';

export const sortByName = (a: ValorantMap, b: ValorantMap): number => {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;

  return 0;
};

export const addMapToCache = (map: ValorantMap, setCachedMaps: React.Dispatch<React.SetStateAction<ValorantMap[]>>) => {
  setCachedMaps((prev) => {
    const exists = prev.some((cachedMap) => cachedMap.id === map.id);

    if (exists) return prev;

    const updated = [...prev, map];
    return updated.sort(sortByName);
  });
};

export const deleteMapFromCache = (
  map: ValorantMap,
  setCachedMaps: React.Dispatch<React.SetStateAction<ValorantMap[]>>
) => {
  setCachedMaps((prev) => {
    const exists = prev.some((cachedMap) => cachedMap.id === map.id);

    if (!exists) return prev;

    const updated = prev.filter((cachedMap) => cachedMap.id !== map.id);
    return updated.sort(sortByName);
  });
};

export const updateMapFromCache = (
  map: ValorantMap,
  setCachedMaps: React.Dispatch<React.SetStateAction<ValorantMap[]>>
) => {
  setCachedMaps((prev) => {
    const exists = prev.some((cachedMap) => cachedMap.id === map.id);

    if (!exists) return prev;

    const updated = prev.map((cachedMap) => (cachedMap.id === map.id ? map : cachedMap));

    return updated.sort(sortByName);
  });
};

export const handleInsert = async (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  formData: React.MutableRefObject<ValorantMapFormType | undefined>,
  setCachedMaps: React.Dispatch<React.SetStateAction<ValorantMap[]>>
) => {
  const addNewMap = async () => {
    try {
      const createdMap: ValorantMap | null = await createMap(formData.current as ValorantMapFormType);

      setModalProps(callModalTemplate('Valorant Map', 'success', 'add', setModalProps));
      setTimeout(() => {
        addMapToCache(createdMap as ValorantMap, setCachedMaps);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(callModalTemplate('Valorant Map', 'error', 'add', setModalProps));
    }
  };

  const props: ModalProps = {
    title: 'Adding Valorant Map',
    type: 'info',
    message: 'Fill out the details to add a new Valorant map.',
    onCancel: () => setModalProps(null),
    onConfirm: async () => {
      await addNewMap();
    },
    children: <ValorantMapForm formData={formData} map={null} />
  };

  setModalProps(props);
};

export const handleDelete = (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  map: ValorantMap,
  setCachedMaps: React.Dispatch<React.SetStateAction<ValorantMap[]>>
) => {
  const deleteMap = async (schedule: ValorantMap) => {
    try {
      await deleteMapById(map.id as string);

      setModalProps(callModalTemplate('Valorant Map', 'success', 'delete', setModalProps));

      setTimeout(() => {
        deleteMapFromCache(map, setCachedMaps);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(callModalTemplate('Valorant Map', 'error', 'add', setModalProps));
    }
  };

  const props: ModalProps = {
    title: 'Deleting Valorant Map',
    type: 'warning',
    message: `Are you sure you want to delete this Valorant map?`,
    onCancel: () => setModalProps(null),
    onConfirm: async () => {
      await deleteMap(map);
    }
  };

  setModalProps(props);
};

export const handleUpdate = async (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  formData: React.MutableRefObject<ValorantMapFormType | undefined>,
  map: ValorantMap,
  setCachedMaps: React.Dispatch<React.SetStateAction<ValorantMap[]>>
) => {
  const updateExistingMap = async () => {
    try {
      const updatedMap = await updateMapById(map.id, formData.current as ValorantMapFormType);

      setModalProps(callModalTemplate('Valorant Map', 'success', 'update', setModalProps));

      setTimeout(() => {
        if (map.splash_image_url) {
          const url = new URL(map.splash_image_url);
          const fileName = url.pathname.replace('/storage/v1/object/sign/images/', '');
          deleteFile('images', [fileName]);
        }
        updateMapFromCache(updatedMap as ValorantMap, setCachedMaps);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(callModalTemplate('Valorant Map', 'error', 'update', setModalProps));
    }
  };

  const props: ModalProps = {
    title: 'Updating Valorant Map',
    type: 'info',
    message: 'Fill out the details to update Valorant Map.',
    onCancel: () => setModalProps(null),
    onConfirm: async () => {
      await updateExistingMap();
    },
    children: <ValorantMapForm formData={formData} map={map} />
  };

  setModalProps(props);
};
