import { GamePlatform, LeagueSchedule, Series, Team } from '@/lib/types';
import {
  checkTie,
  getTeamStandings,
  resolveTieBreakers,
  updateMatchupsAndResults
} from '@/app/(user)/standings/_views/utils';
import GroupTable from '@/app/(user)/standings/_components/group-table';

interface GroupstageViewProps {
  seriesList: Series[];
  teamsList: Team[];
  matchedPlatform: GamePlatform;
  leagueSchedule: LeagueSchedule;
}

const getDistinctTeamIds = (seriesList: Series[]): string[] => {
  const teamIds = new Set<string>();

  seriesList.forEach(({ team_a_id, team_b_id }) => {
    teamIds.add(team_a_id);
    teamIds.add(team_b_id);
  });

  return Array.from(teamIds);
};

export default async function PlayinsView({
  seriesList,
  teamsList,
  leagueSchedule,
  matchedPlatform
}: GroupstageViewProps) {
  const isValorant = matchedPlatform.platform_abbrev === 'VALO';
  const showRoundDiff =
    leagueSchedule.season_type === 'Season' && leagueSchedule.season_number === 3;

  const teamIds = getDistinctTeamIds(seriesList);
  const { teamResults, headToHeadWins } = await updateMatchupsAndResults(
    seriesList,
    isValorant,
    leagueSchedule.id
  );

  let teamStandings = getTeamStandings(teamIds, teamsList, teamResults);

  const { hasTie, tiedPoints } = checkTie(teamStandings);

  if (hasTie) {
    teamStandings = resolveTieBreakers(teamStandings, headToHeadWins, tiedPoints);
  }

  if (teamStandings.length === 1) {
    while (teamStandings.length < 4) {
      teamStandings.push({ ...teamStandings[0] });
    }
  }

  return (
    <div className="flex flex-col p-4">
      <div className="w-full p-2">
        <h3 className="text-xl">Play-Ins</h3>
        {teamStandings ? (
          <GroupTable
            groupStanding={teamStandings}
            isValorant={isValorant}
            showRoundDiff={showRoundDiff}
          />
        ) : (
          <p>No records available</p>
        )}
      </div>
    </div>
  );
}
