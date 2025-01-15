import { createTeam, deleteTeamById, getTeamById, getTeamsByIndexRange, updateTeam } from '@/api/team';
import { ModalProps } from '@/components/modal';
import { Team, TeamFormType } from '@/lib/types';
import React from 'react';
import TeamForm from '@/components/admin/clients/teams/form';
import { deleteFile } from '@/api/utils/storage';

export const sortByName = (a: Team, b: Team): number => {
  if (a.school_abbrev < b.school_abbrev) return -1;
  if (a.school_abbrev > b.school_abbrev) return 1;

  return 0;
};

export const addTeamToCache = (team: Team, setCachedTeams: React.Dispatch<React.SetStateAction<Team[]>>) => {
  setCachedTeams((prev) => {
    const exists = prev.some((cachedTeam) => cachedTeam.id === team.id);

    if (exists) return prev;

    const updated = [...prev, team];
    return updated.sort(sortByName);
  });
};

export const deleteTeamFromCache = (team: Team, setCachedTeams: React.Dispatch<React.SetStateAction<Team[]>>) => {
  setCachedTeams((prev) => {
    const exists = prev.some((cachedTeam) => cachedTeam.id === team.id);

    if (!exists) return prev;

    const updated = prev.filter((cachedTeam) => cachedTeam.id !== team.id);
    return updated.sort(sortByName);
  });
};

export const updateTeamFromCache = (team: Team, setCachedTeams: React.Dispatch<React.SetStateAction<Team[]>>) => {
  setCachedTeams((prev) => {
    const exists = prev.some((cachedTeam) => cachedTeam.id === team.id);

    if (!exists) return prev;

    const updated = prev.map((cachedTeam) => (cachedTeam.id === team.id ? team : cachedTeam));

    return updated.sort(sortByName);
  });
};

export const handleInsert = async (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  formData: React.MutableRefObject<TeamFormType | undefined>,
  setCachedTeams: React.Dispatch<React.SetStateAction<Team[]>>
) => {
  const addNewTeam = async () => {
    const successModal: ModalProps = {
      title: 'Success',
      message: 'Team has been successfully added!',
      type: 'success'
    };

    const failedModal: ModalProps = {
      title: 'Error',
      message: 'Failed to add Team. Please try again.',
      type: 'error',
      onCancel: () => setModalProps(null)
    };

    try {
      const createdTeam: Team | null = await createTeam(formData.current as TeamFormType);

      setModalProps(successModal);
      setTimeout(() => {
        addTeamToCache(createdTeam as Team, setCachedTeams);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(failedModal);
    }
  };

  const props: ModalProps = {
    title: 'Adding New Team',
    type: 'info',
    message: 'Fill out the details to add a new Team.',
    onCancel: () => setModalProps(null),
    onConfirm: async () => {
      await addNewTeam();
    },
    children: <TeamForm formData={formData} team={null} />
  };

  setModalProps(props);
};

export const handleDelete = (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  team: Team,
  setCachedTeams: React.Dispatch<React.SetStateAction<Team[]>>
) => {
  const deleteTeam = async (team: Team) => {
    const successModal: ModalProps = {
      title: 'Success',
      message: `Team has been successfully deleted.`,
      type: 'success'
    };

    const failedModal: ModalProps = {
      title: 'Error',
      message: `Failed to delete Team. Please try again.`,
      type: 'error',
      onCancel: () => setModalProps(null)
    };

    try {
      await deleteTeamById(team.id as string);

      setModalProps(successModal);

      setTimeout(() => {
        deleteTeamFromCache(team, setCachedTeams);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(failedModal);
    }
  };

  const props: ModalProps = {
    title: 'Deleting Team',
    type: 'warning',
    message: `Are you sure you want to delete ${team.school_abbrev}?`,
    onCancel: () => setModalProps(null),
    onConfirm: async () => {
      await deleteTeam(team);
    }
  };

  setModalProps(props);
};

export const handleUpdate = async (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  formData: React.MutableRefObject<TeamFormType | undefined>,
  team: Team,
  setCachedTeams: React.Dispatch<React.SetStateAction<Team[]>>
) => {
  const updateExistingTeam = async () => {
    const successModal: ModalProps = {
      title: 'Success',
      message: 'Team has been successfully updated!',
      type: 'success'
    };

    const failedModal: ModalProps = {
      title: 'Error',
      message: 'Failed to update Team. Please try again.',
      type: 'error',
      onCancel: () => setModalProps(null)
    };

    try {
      const updatedTeam = await updateTeam(team.id, formData.current as TeamFormType);

      setModalProps(successModal);

      setTimeout(() => {
        const url = new URL(team.logo_url);
        const fileName = url.pathname.replace('/storage/v1/object/sign/images/', '');
        deleteFile('images', [fileName]);
        updateTeamFromCache(updatedTeam as Team, setCachedTeams);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(failedModal);
    }
  };

  const props: ModalProps = {
    title: 'Updating Team',
    type: 'info',
    message: 'Fill out the details to update Team.',
    onCancel: () => setModalProps(null),
    onConfirm: async () => {
      await updateExistingTeam();
    },
    children: <TeamForm formData={formData} team={team} />
  };

  setModalProps(props);
};
