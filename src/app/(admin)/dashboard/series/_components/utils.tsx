import { ModalProps } from '@/components/ui/modal';
import {
  GamePlatform,
  LeagueSchedule,
  Series,
  SeriesFormType,
  SeriesWithDetails,
  Team
} from '@/lib/types';
import React from 'react';
import { callModalTemplate } from '@/app/(admin)/dashboard/utils';
import {
  appendSeriesDetails,
  createSeries,
  deleteSeriesById,
  updateSeriesById
} from '@/api/series';
import SeriesForm from '@/app/(admin)/dashboard/series/_components/form';

export const sortByStartTime = (
  a: SeriesWithDetails | Series,
  b: SeriesWithDetails | Series
): number => {
  if (a.start_time > b.start_time) return 1;
  if (a.start_time < b.start_time) return -1;

  return 0;
};

export const addSeriesToCache = (
  series: SeriesWithDetails,
  setCachedSeries: React.Dispatch<React.SetStateAction<SeriesWithDetails[]>>
) => {
  setCachedSeries((prev) => {
    const exists = prev.some((cachedSeries) => cachedSeries.id === series.id);

    if (exists) return prev;

    const updated = [...prev, series];
    return updated.sort(sortByStartTime);
  });
};

export const deleteSeriesFromCache = (
  series: SeriesWithDetails,
  setCachedSeries: React.Dispatch<React.SetStateAction<SeriesWithDetails[]>>
) => {
  setCachedSeries((prev) => {
    const exists = prev.some((cachedSeries) => cachedSeries.id === series.id);

    if (!exists) return prev;

    const updated = prev.filter((cachedSeries) => cachedSeries.id !== series.id);
    return updated.sort(sortByStartTime);
  });
};

export const updateSeriesFromCache = (
  series: SeriesWithDetails,
  setCachedSeries: React.Dispatch<React.SetStateAction<SeriesWithDetails[]>>
) => {
  setCachedSeries((prev) => {
    const exists = prev.some((cachedSeries) => cachedSeries.id === series.id);

    if (!exists) return prev;

    const updated = prev.map((cachedSeries) =>
      cachedSeries.id === series.id ? series : cachedSeries
    );

    return updated.sort(sortByStartTime);
  });
};

export const handleInsert = async (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  formData: React.MutableRefObject<SeriesFormType | undefined>,
  platformList: GamePlatform[],
  teamList: Team[],
  leagueScheduleList: LeagueSchedule[],
  setCachedSeries: React.Dispatch<React.SetStateAction<SeriesWithDetails[]>>
) => {
  const addNewSeries = async () => {
    try {
      const createdSeries: Series | null = await createSeries(formData.current as SeriesFormType);
      const processedSeries: SeriesWithDetails = appendSeriesDetails(
        platformList,
        teamList,
        leagueScheduleList,
        createdSeries as Series
      );
      setModalProps(callModalTemplate('Series', 'success', 'add', setModalProps));
      setTimeout(() => {
        addSeriesToCache(processedSeries, setCachedSeries);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(callModalTemplate('Series', 'error', 'add', setModalProps));
    }
  };

  const props: ModalProps = {
    title: 'Adding New Series',
    type: 'info',
    message: 'Fill out the details to add a new series.',
    onCancel: () => setModalProps(null),
    onConfirm: async () => {
      await addNewSeries();
    },
    children: (
      <SeriesForm
        formData={formData}
        series={null}
        platformList={platformList}
        teamList={teamList}
        leagueScheduleList={leagueScheduleList}
      />
    )
  };

  setModalProps(props);
};

export const handleDelete = (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  series: SeriesWithDetails,
  setCachedSeries: React.Dispatch<React.SetStateAction<SeriesWithDetails[]>>
) => {
  const deleteSeries = async (series: SeriesWithDetails) => {
    try {
      await deleteSeriesById(series.id as string);

      setModalProps(callModalTemplate('Series', 'success', 'delete', setModalProps));

      setTimeout(() => {
        deleteSeriesFromCache(series, setCachedSeries);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(callModalTemplate('Series', 'error', 'delete', setModalProps));
    }
  };

  const props: ModalProps = {
    title: 'Deleting Series',
    type: 'warning',
    message: `Are you sure you want to delete series?`,
    onCancel: () => setModalProps(null),
    onConfirm: async () => {
      await deleteSeries(series);
    }
  };

  setModalProps(props);
};

export const handleUpdate = async (
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>,
  formData: React.MutableRefObject<SeriesFormType | undefined>,
  series: SeriesWithDetails,
  platformList: GamePlatform[],
  teamList: Team[],
  leagueScheduleList: LeagueSchedule[],
  setCachedSeries: React.Dispatch<React.SetStateAction<SeriesWithDetails[]>>
) => {
  const processedTeamList = teamList.filter((team) => team.school_abbrev !== 'TBD');

  const updateExistingSeries = async () => {
    try {
      const updatedSeries: Series | null = await updateSeriesById(
        series.id,
        formData.current as SeriesFormType
      );
      const processedSeries: SeriesWithDetails = appendSeriesDetails(
        platformList,
        teamList,
        leagueScheduleList,
        updatedSeries as Series
      );

      setModalProps(callModalTemplate('Series', 'success', 'update', setModalProps));

      setTimeout(() => {
        updateSeriesFromCache(processedSeries, setCachedSeries);
        setModalProps(null);
      }, 500);
    } catch (error) {
      setModalProps(callModalTemplate('Series', 'error', 'update', setModalProps));
    }
  };

  const props: ModalProps = {
    title: 'Updating Series',
    type: 'info',
    message: 'Fill out the details to update series.',
    onCancel: () => setModalProps(null),
    onConfirm: async () => {
      await updateExistingSeries();
    },
    children: (
      <SeriesForm
        formData={formData}
        series={series}
        leagueScheduleList={leagueScheduleList}
        platformList={platformList}
        teamList={processedTeamList}
      />
    )
  };

  setModalProps(props);
};
