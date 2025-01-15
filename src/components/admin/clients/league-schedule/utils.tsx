import { createLeagueSchedule, deleteLeagueSchedule, updateLeagueScheduleById } from '@/api/league-schedule';
import { getAllGamePlatforms } from '@/api/game-platform';
import { ModalProps } from '@/components/modal';
import { LeagueSchedule } from '@/lib/types';
import React from 'react';
import LeagueScheduleForm from '@/components/admin/clients/league-schedule/form';

export const sortByStartDate = (a: LeagueSchedule, b: LeagueSchedule): number => {
  if (a.start_date < b.start_date) return -1;
  if (a.start_date > b.start_date) return 1;

  return 0;
};

export const addScheduleToCache = (
  schedule: LeagueSchedule,
  setCachedSchedules: React.Dispatch<React.SetStateAction<LeagueSchedule[]>>
) => {
  setCachedSchedules((prev) => {
    const exists = prev.some((cachedSched) => cachedSched.id === schedule.id);

    if (exists) return prev;

    const updated = [...prev, schedule];
    return updated.sort(sortByStartDate);
  });
};

export const deleteScheduleFromCache = (
  schedule: LeagueSchedule,
  setCachedSchedules: React.Dispatch<React.SetStateAction<LeagueSchedule[]>>
) => {
  setCachedSchedules((prev) => {
    const exists = prev.some((cachedSched) => cachedSched.id === schedule.id);

    if (!exists) return prev;

    const updated = prev.filter((cachedSched) => cachedSched.id !== schedule.id);
    return updated.sort(sortByStartDate);
  });
};

export const updateScheduleFromCache = (
  schedule: LeagueSchedule,
  setCachedSchedules: React.Dispatch<React.SetStateAction<LeagueSchedule[]>>
) => {
  setCachedSchedules((prev) => {
    const exists = prev.some((cachedSched) => cachedSched.id === schedule.id);

    if (!exists) return prev;

    const updated = prev.map((cachedSched) => (cachedSched.id === schedule.id ? schedule : cachedSched));

    return updated.sort(sortByStartDate);
  });
};

export const handleInsert = async (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  formData: React.MutableRefObject<Partial<LeagueSchedule>>,
  setCachedSchedules: React.Dispatch<React.SetStateAction<LeagueSchedule[]>>
) => {
  const addNewSchedule = async () => {
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
      const createdSchedule: LeagueSchedule | null = await createLeagueSchedule(formData.current as {});

      setModalProps(successModal);
      setTimeout(() => {
        addScheduleToCache(createdSchedule as LeagueSchedule, setCachedSchedules);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(failedModal);
    }
  };

  const props: ModalProps = {
    title: 'Adding New Schedule',
    type: 'info',
    message: 'Fill out the details to add a new game Schedule.',
    onCancel: () => setModalProps(null),
    onConfirm: async () => {
      await addNewSchedule();
    },
    children: <LeagueScheduleForm formData={formData} schedule={null} />
  };

  setModalProps(props);
};

export const handleDelete = (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  Schedule: LeagueSchedule,
  setCachedSchedules: React.Dispatch<React.SetStateAction<LeagueSchedule[]>>
) => {
  const deleteSchedule = async (schedule: LeagueSchedule) => {
    const successModal: ModalProps = {
      title: 'Success',
      message: `League Schedule has been successfully deleted.`,
      type: 'success'
    };

    const failedModal: ModalProps = {
      title: 'Error',
      message: `Failed to delete League Schedule. Please try again.`,
      type: 'error',
      onCancel: () => setModalProps(null)
    };

    try {
      await deleteLeagueSchedule(schedule.id as string);

      setModalProps(successModal);

      setTimeout(() => {
        deleteScheduleFromCache(Schedule, setCachedSchedules);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(failedModal);
    }
  };

  const props: ModalProps = {
    title: 'Deleting Schedule',
    type: 'warning',
    message: `Are you sure you want to delete League Schedule?`,
    onCancel: () => setModalProps(null),
    onConfirm: async () => {
      await deleteSchedule(Schedule);
    }
  };

  setModalProps(props);
};

export const handleUpdate = async (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  formData: React.MutableRefObject<Partial<LeagueSchedule>>,
  schedule: LeagueSchedule,
  setCachedSchedules: React.Dispatch<React.SetStateAction<LeagueSchedule[]>>
) => {
  const updateExistingSchedule = async () => {
    const successModal: ModalProps = {
      title: 'Success',
      message: 'Schedule has been successfully updated!',
      type: 'success'
    };

    const failedModal: ModalProps = {
      title: 'Error',
      message: 'Failed to update Schedule. Please try again.',
      type: 'error',
      onCancel: () => setModalProps(null)
    };

    try {
      const updatedSchedule = await updateLeagueScheduleById(schedule.id, formData.current as {});

      setModalProps(successModal);

      setTimeout(() => {
        updateScheduleFromCache(updatedSchedule as LeagueSchedule, setCachedSchedules);
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
      await updateExistingSchedule();
    },
    children: <LeagueScheduleForm formData={formData} schedule={schedule} />
  };

  setModalProps(props);
};
