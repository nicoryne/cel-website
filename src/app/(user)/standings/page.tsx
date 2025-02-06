import { getLatestLeagueSchedule } from '@/api/league-schedule';
import { redirect } from 'next/navigation';

export default async function StandingsPage() {
  const schedule = await getLatestLeagueSchedule();

  if (!schedule) {
    redirect('/error');
  }

  const { season_type, season_number, league_stage } = schedule;

  redirect(
    `/standings/${season_type.toLowerCase()}/${season_number}/mlbb/${league_stage.toLowerCase()}`
  );

  return null;
}
