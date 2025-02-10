import { GamePlatform, LeagueSchedule, Series, Team } from '@/lib/types';
import { getTeamRoundDiff } from '@/api/valorant-match';
import GroupContainer from '../_components/group-container';
import GroupTable from '../_components/group-table';
import { getTeamStandings, updateMatchupsAndResults } from './utils';

interface GroupstageViewProps {
  seriesList: Series[];
  teamsList: Team[];
  matchedPlatform: GamePlatform;
  leagueSchedule: LeagueSchedule;
}

const assignTeamsToGroups = (seriesList: Series[], matchups: Record<string, Set<string>>) => {
  let groupA = new Set<string>();
  let groupB = new Set<string>();

  seriesList.forEach(({ team_a_id, team_b_id }) => {
    // check if team_a or team_b has played against anyone in group a or group b
    const hasPlayedInGroupA = [...groupA].some((team) => matchups[team_a_id].has(team));
    const hasPlayedInGroupB = [...groupB].some((team) => matchups[team_a_id].has(team));
    const hasPlayedInGroupAForB = [...groupA].some((team) => matchups[team_b_id].has(team));
    const hasPlayedInGroupBForB = [...groupB].some((team) => matchups[team_b_id].has(team));

    // assign the teams to a group based on matchups
    if (hasPlayedInGroupA || hasPlayedInGroupAForB) {
      groupA.add(team_a_id);
      groupA.add(team_b_id);
    } else if (hasPlayedInGroupB || hasPlayedInGroupBForB) {
      groupB.add(team_a_id);
      groupB.add(team_b_id);
    } else {
      // if they haven't played against anyone in a or b, add to the smaller group
      if (groupA.size <= groupB.size) {
        groupA.add(team_a_id);
        groupA.add(team_b_id);
      } else {
        groupB.add(team_a_id);
        groupB.add(team_b_id);
      }
    }
  });

  // group a usually has more teams so if it isn't the case then we switch
  if (groupB.size > groupA.size) {
    let temp = groupA;
    groupA = groupB;
    groupB = temp;
  }

  return { groupA, groupB };
};

const getGroupings = async (
  seriesList: Series[],
  teamsList: Team[],
  isValorant: boolean,
  leagueScheduleId: string
) => {
  const { matchups, teamResults } = await updateMatchupsAndResults(
    seriesList,
    isValorant,
    leagueScheduleId
  );

  const { groupA, groupB } = assignTeamsToGroups(seriesList, matchups);

  return { groupAIds: Array.from(groupA), groupBIds: Array.from(groupB), teamResults };
};

export default async function GroupstageView({
  seriesList,
  teamsList,
  matchedPlatform,
  leagueSchedule
}: GroupstageViewProps) {
  const isValorant = matchedPlatform.platform_abbrev === 'VALO';
  const showRoundDiff =
    leagueSchedule.season_type === 'Season' && leagueSchedule.season_number === 3;

  const { groupAIds, groupBIds, teamResults } = await getGroupings(
    seriesList,
    teamsList,
    isValorant,
    leagueSchedule.id
  );

  const groupA = getTeamStandings(groupAIds, teamsList, teamResults);
  const groupB = getTeamStandings(groupBIds, teamsList, teamResults);

  return (
    <div className="flex flex-col p-4 xl:flex-row">
      <div className="w-full p-2 pt-4 xl:w-1/2">
        <h3 className="text-xl">Group A</h3>
        {groupA.length > 0 ? (
          <GroupTable
            groupStanding={groupA}
            isValorant={isValorant}
            showRoundDiff={showRoundDiff}
          />
        ) : (
          <p className="pt-4">No records available</p>
        )}
      </div>

      <div className="w-full p-2 pt-4 xl:w-1/2">
        <h3 className="text-xl">Group B</h3>
        {groupB.length > 0 ? (
          <GroupTable
            groupStanding={groupB}
            isValorant={isValorant}
            showRoundDiff={showRoundDiff}
          />
        ) : (
          <p className="pt-4">No records available</p>
        )}
      </div>
    </div>
  );
}
