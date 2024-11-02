import { getAllSeriesWithDetails } from '@/api/series';
import AdminSeriesClient from '@/components/admin/AdminSeriesClient';

export default async function AdminSeries() {
  const seriesList = await getAllSeriesWithDetails();

  return (
    <>
      <AdminSeriesClient seriesList={seriesList} />
    </>
  );
}
