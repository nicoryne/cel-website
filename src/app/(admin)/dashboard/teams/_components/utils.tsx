import { createTeam, deleteTeamById, updateTeamById } from '@/api/team';
import { ModalProps } from '@/components/ui/modal';
import { Team, TeamFormType } from '@/lib/types';
import React from 'react';
import TeamForm from '@/app/(admin)/dashboard/teams/_components/form';
import { deleteFile } from '@/api/utils/storage';
import { callModalTemplate } from '@/app/(admin)/dashboard/utils';

export const sortByName = (a: Team, b: Team): number => {
  if (a.school_abbrev < b.school_abbrev) return -1;
  if (a.school_abbrev > b.school_abbrev) return 1;

  return 0;
};

export const addTeamToCache = (
  team: Team,
  setCachedTeams: React.Dispatch<React.SetStateAction<Team[]>>
) => {
  setCachedTeams((prev) => {
    const exists = prev.some((cachedTeam) => cachedTeam.id === team.id);

    if (exists) return prev;

    const updated = [...prev, team];
    return updated.sort(sortByName);
  });
};

export const deleteTeamFromCache = (
  team: Team,
  setCachedTeams: React.Dispatch<React.SetStateAction<Team[]>>
) => {
  setCachedTeams((prev) => {
    const exists = prev.some((cachedTeam) => cachedTeam.id === team.id);

    if (!exists) return prev;

    const updated = prev.filter((cachedTeam) => cachedTeam.id !== team.id);
    return updated.sort(sortByName);
  });
};

export const updateTeamFromCache = (
  team: Team,
  setCachedTeams: React.Dispatch<React.SetStateAction<Team[]>>
) => {
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
    try {
      const createdTeam: Team | null = await createTeam(formData.current as TeamFormType);

      setModalProps(callModalTemplate('Team', 'success', 'add', setModalProps));
      setTimeout(() => {
        addTeamToCache(createdTeam as Team, setCachedTeams);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(callModalTemplate('Team', 'error', 'add', setModalProps));
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
    try {
      await deleteTeamById(team.id as string);

      setModalProps(callModalTemplate('Team', 'success', 'delete', setModalProps));

      setTimeout(() => {
        deleteTeamFromCache(team, setCachedTeams);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(callModalTemplate('Team', 'error', 'delete', setModalProps));
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
    try {
      const updatedTeam = await updateTeamById(team.id, formData.current as TeamFormType);

      setModalProps(callModalTemplate('Team', 'success', 'update', setModalProps));

      setTimeout(() => {
        const url = new URL(team.logo_url);
        const fileName = url.pathname.replace('/storage/v1/object/sign/images/', '');
        deleteFile('images', [fileName]);
        updateTeamFromCache(updatedTeam as Team, setCachedTeams);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(callModalTemplate('Team', 'error', 'update', setModalProps));
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
