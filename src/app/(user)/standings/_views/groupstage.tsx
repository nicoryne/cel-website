import { GamePlatform, LeagueSchedule, Series, Team } from '@/lib/types';
import { getTeamRoundDiff } from '@/api/valorant-match';
import GroupContainer from '../_components/group-container';

interface GroupstageViewProps {
  seriesList: Series[];
  teamsList: Team[];
  matchedPlatform: GamePlatform;
  leagueSchedule: LeagueSchedule;
}

export interface GroupResults {
  wins: number;
  losses: number;
  draws: number;
  points: number;
  roundDiff?: number;
}

// the logic here is to track all matchups. all teams who face each other
// should always be in the same group, so if a team has 0 matchups against another team
// then they aren't in the same group.

// TODO: optimize this. looks very dirty tbh
const updateMatchupsAndResults = async (
  seriesList: Series[],
  isValorant: boolean,
  leagueScheduleId: string
) => {
  const matchups: Record<string, Set<string>> = {};
  const teamResults: Record<string, GroupResults> = {};

  for (const {
    team_a_id,
    team_b_id,
    team_a_status,
    team_b_status,
    team_a_score,
    team_b_score
  } of seriesList) {
    // Initialize matchups if they don't exist
    if (!matchups[team_a_id]) matchups[team_a_id] = new Set();
    if (!matchups[team_b_id]) matchups[team_b_id] = new Set();

    matchups[team_a_id].add(team_b_id);
    matchups[team_b_id].add(team_a_id);

    // Initialize team results if they don't exist
    if (!teamResults[team_a_id])
      teamResults[team_a_id] = { wins: 0, losses: 0, draws: 0, points: 0, roundDiff: 0 };
    if (!teamResults[team_b_id])
      teamResults[team_b_id] = { wins: 0, losses: 0, draws: 0, points: 0, roundDiff: 0 };

    // Handle wins, draws, and losses
    if (team_a_score === team_b_score && team_a_score !== 0 && team_b_score !== 0) {
      teamResults[team_a_id].draws += 1;
      teamResults[team_b_id].draws += 1;
      teamResults[team_a_id].points += 1;
      teamResults[team_b_id].points += 1;
    } else if (team_a_status === 'Win') {
      teamResults[team_a_id].wins += 1;
      teamResults[team_a_id].points += 3;
      teamResults[team_b_id].losses += 1;
    } else if (team_b_status === 'Win') {
      teamResults[team_b_id].wins += 1;
      teamResults[team_b_id].points += 3;
      teamResults[team_a_id].losses += 1;
    }

    // **Fix: Fetch round difference properly**
    if (isValorant) {
      try {
        const [teamARoundDiff, teamBRoundDiff] = await Promise.all([
          getTeamRoundDiff(team_a_id, leagueScheduleId),
          getTeamRoundDiff(team_b_id, leagueScheduleId)
        ]);

        teamResults[team_a_id].roundDiff = teamARoundDiff || 0;
        teamResults[team_b_id].roundDiff = teamBRoundDiff || 0;
      } catch (error) {
        console.error(`Error fetching roundDiff: ${error}`);
      }
    }
  }

  return { matchups, teamResults };
};

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

const getTeamStandings = (
  teamIds: string[],
  teamsList: Team[],
  teamResults: Record<string, GroupResults>
) => {
  return teamIds
    .map((teamId) => {
      const team = teamsList.find((t) => t.id === teamId);
      return {
        team,
        wins: teamResults[teamId]?.wins || 0,
        losses: teamResults[teamId]?.losses || 0,
        draws: teamResults[teamId]?.draws || 0,
        points: teamResults[teamId]?.points || 0,
        roundDiff: teamResults[teamId]?.roundDiff || 0
      };
    })
    .sort((a, b) => {
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }

      if (b.losses !== a.losses) {
        return a.losses - b.losses;
      }

      if (b.draws !== a.draws) {
        return b.draws - a.draws;
      }

      if (b.roundDiff !== a.roundDiff) {
        return b.roundDiff - a.roundDiff;
      }

      return (a.team?.school_abbrev || '').localeCompare(b.team?.school_abbrev || '');
    });
};

export default async function GroupstageView({
  seriesList,
  teamsList,
  matchedPlatform,
  leagueSchedule
}: GroupstageViewProps) {
  const isValorant = matchedPlatform.platform_abbrev === 'VALO';
  const { groupAIds, groupBIds, teamResults } = await getGroupings(
    seriesList,
    teamsList,
    isValorant,
    leagueSchedule.id
  );

  const groupA = getTeamStandings(groupAIds, teamsList, teamResults);
  const groupB = getTeamStandings(groupBIds, teamsList, teamResults);

  return (
    <div className="flex flex-col p-4 md:flex-row">
      <div className="w-full p-2 md:w-1/2">
        <h3 className="mb-2 border-b py-4 text-xl dark:border-neutral-700">Group A</h3>
        {groupA.length > 0 ? (
          <ul className="space-y-2">
            {groupA.map(({ team, wins, losses, draws, points, roundDiff }, index) => (
              <GroupContainer
                team={team}
                results={{ wins, losses, draws, points, roundDiff }}
                index={index}
                isValorant={isValorant}
                showRoundDiff={
                  leagueSchedule.season_type === 'Season' && leagueSchedule.season_number === 3
                }
              />
            ))}
          </ul>
        ) : (
          <p>No records available</p>
        )}
      </div>

      <div className="w-full p-2 md:w-1/2">
        <h3 className="mb-2 border-b py-4 text-xl dark:border-neutral-700">Group B</h3>
        {groupB.length > 0 ? (
          <ul className="space-y-2">
            {groupB.map(({ team, wins, losses, draws, points, roundDiff }, index) => (
              <GroupContainer
                team={team}
                results={{ wins, losses, draws, points, roundDiff }}
                index={index}
                isValorant={isValorant}
                showRoundDiff={
                  leagueSchedule.season_type === 'Season' && leagueSchedule.season_number === 3
                }
              />
            ))}
          </ul>
        ) : (
          <p>No records available</p>
        )}
      </div>
    </div>
  );
}
