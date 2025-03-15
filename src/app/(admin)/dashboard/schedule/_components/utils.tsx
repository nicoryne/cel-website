import {
  createLeagueSchedule,
  deleteLeagueScheduleById,
  updateLeagueScheduleById
} from '@/services/league-schedule';
import { ModalProps } from '@/components/ui/modal';
import { LeagueSchedule } from '@/lib/types';
import React from 'react';
import LeagueScheduleForm from '@/app/(admin)/dashboard/schedule/_components/form';
import { callModalTemplate } from '@/app/(admin)/dashboard/utils';

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

    const updated = prev.map((cachedSched) =>
      cachedSched.id === schedule.id ? schedule : cachedSched
    );

    return updated.sort(sortByStartDate);
  });
};

export const handleInsert = async (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  formData: React.MutableRefObject<Partial<LeagueSchedule>>,
  setCachedSchedules: React.Dispatch<React.SetStateAction<LeagueSchedule[]>>
) => {
  const addNewSchedule = async () => {
    try {
      const createdSchedule: LeagueSchedule | null = await createLeagueSchedule(
        formData.current as {}
      );

      setModalProps(callModalTemplate('League Schedule', 'success', 'add', setModalProps));
      setTimeout(() => {
        addScheduleToCache(createdSchedule as LeagueSchedule, setCachedSchedules);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(callModalTemplate('League Schedule', 'error', 'add', setModalProps));
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
    try {
      await deleteLeagueScheduleById(schedule.id as string);

      setModalProps(callModalTemplate('League Schedule', 'success', 'delete', setModalProps));

      setTimeout(() => {
        deleteScheduleFromCache(Schedule, setCachedSchedules);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(callModalTemplate('League Schedule', 'error', 'delete', setModalProps));
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
    try {
      const updatedSchedule = await updateLeagueScheduleById(schedule.id, formData.current as {});

      setModalProps(callModalTemplate('League Schedule', 'success', 'update', setModalProps));

      setTimeout(() => {
        updateScheduleFromCache(updatedSchedule as LeagueSchedule, setCachedSchedules);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(callModalTemplate('League Schedule', 'error', 'update', setModalProps));
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
