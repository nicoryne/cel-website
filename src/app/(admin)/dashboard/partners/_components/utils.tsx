import { createPartner, deletePartnerById, updatePartnerById } from '@/services/partner';
import { ModalProps } from '@/components/ui/modal';
import { Partner, PartnerFormType } from '@/lib/types';
import React from 'react';
import PartnerForm from '@/app/(admin)/dashboard/partners/_components/form';
import { deleteFile } from '@/services/utils/storage';
import { callModalTemplate } from '@/app/(admin)/dashboard/utils';

export const sortByName = (a: Partner, b: Partner): number => {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;

  return 0;
};

export const addPartnerToCache = (
  partner: Partner,
  setCachedPartners: React.Dispatch<React.SetStateAction<Partner[]>>
) => {
  setCachedPartners((prev) => {
    const exists = prev.some((cachedPartners) => cachedPartners.id === partner.id);

    if (exists) return prev;

    const updated = [...prev, partner];
    return updated.sort(sortByName);
  });
};

export const deletePartnerFromCache = (
  partner: Partner,
  setCachedPartners: React.Dispatch<React.SetStateAction<Partner[]>>
) => {
  setCachedPartners((prev) => {
    const exists = prev.some((cachedPartners) => cachedPartners.id === partner.id);

    if (!exists) return prev;

    const updated = prev.filter((cachedPartners) => cachedPartners.id !== partner.id);
    return updated.sort(sortByName);
  });
};

export const updatePartnerFromCache = (
  partner: Partner,
  setCachedPartners: React.Dispatch<React.SetStateAction<Partner[]>>
) => {
  setCachedPartners((prev) => {
    const exists = prev.some((cachedPartners) => cachedPartners.id === partner.id);

    if (!exists) return prev;

    const updated = prev.map((cachedPartners) =>
      cachedPartners.id === partner.id ? partner : cachedPartners
    );

    return updated.sort(sortByName);
  });
};

export const handleInsert = async (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  formData: React.MutableRefObject<PartnerFormType | undefined>,
  setCachedPartners: React.Dispatch<React.SetStateAction<Partner[]>>
) => {
  const addNewPartner = async () => {
    try {
      const createdPartner: Partner | null = await createPartner(
        formData.current as PartnerFormType
      );

      setModalProps(callModalTemplate('Partner', 'success', 'add', setModalProps));
      setTimeout(() => {
        addPartnerToCache(createdPartner as Partner, setCachedPartners);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(callModalTemplate('Partner', 'error', 'add', setModalProps));
    }
  };

  const props: ModalProps = {
    title: 'Adding New Partner',
    type: 'info',
    message: 'Fill out the details to add a new Partner.',
    onCancel: () => setModalProps(null),
    onConfirm: async () => {
      await addNewPartner();
    },
    children: <PartnerForm formData={formData} partner={null} />
  };

  setModalProps(props);
};

export const handleDelete = (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  partner: Partner,
  setCachedPartners: React.Dispatch<React.SetStateAction<Partner[]>>
) => {
  const deletePartner = async (partner: Partner) => {
    try {
      await deletePartnerById(partner.id as string);

      setModalProps(callModalTemplate('Partner', 'success', 'delete', setModalProps));

      setTimeout(() => {
        deletePartnerFromCache(partner, setCachedPartners);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(callModalTemplate('Partner', 'error', 'delete', setModalProps));
    }
  };

  const props: ModalProps = {
    title: 'Deleting Partner',
    type: 'warning',
    message: `Are you sure you want to delete ${partner.name}?`,
    onCancel: () => setModalProps(null),
    onConfirm: async () => {
      await deletePartner(partner);
    }
  };

  setModalProps(props);
};

export const handleUpdate = async (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  formData: React.MutableRefObject<PartnerFormType | undefined>,
  partner: Partner,
  setCachedPartners: React.Dispatch<React.SetStateAction<Partner[]>>
) => {
  const updateExistingPartner = async () => {
    try {
      const updatedPartner = await updatePartnerById(
        partner.id,
        formData.current as PartnerFormType
      );

      setModalProps(callModalTemplate('Partner', 'success', 'update', setModalProps));

      setTimeout(() => {
        const url = new URL(partner.logo_url);
        const fileName = url.pathname.replace('/storage/v1/object/sign/images/', '');
        deleteFile('images', [fileName]);
        updatePartnerFromCache(updatedPartner as Partner, setCachedPartners);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(callModalTemplate('Partner', 'error', 'update', setModalProps));
    }
  };

  const props: ModalProps = {
    title: 'Updating Partner',
    type: 'info',
    message: 'Fill out the details to update Partner.',
    onCancel: () => setModalProps(null),
    onConfirm: async () => {
      await updateExistingPartner();
    },
    children: <PartnerForm formData={formData} partner={partner} />
  };

  setModalProps(props);
};
