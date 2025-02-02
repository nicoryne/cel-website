import { GamePlatform, Series, Team } from '@/lib/types';
import Image from 'next/image';
import not_found from '@/../../public/images/not-found.webp';

interface GroupstageViewProps {
  seriesList: Series[];
  teamsList: Team[];
  platformList: GamePlatform[];
}

// the logic here is to track all matchups. all teams who face each other
// should always be in the same group, so if a team has 0 matchups against another team
// then they aren't in the same group.

// TODO: optimize this. looks very dirty tbh
const updateMatchupsAndResults = (seriesList: Series[]) => {
  const matchups: Record<string, Set<string>> = {};
  const teamResults: Record<string, { wins: number; losses: number }> = {};

  seriesList.forEach(({ team_a_id, team_b_id, team_a_status, team_b_status }) => {
    // make new set for every team if they don't have one already
    if (!matchups[team_a_id]) matchups[team_a_id] = new Set();
    if (!matchups[team_b_id]) matchups[team_b_id] = new Set();

    matchups[team_a_id].add(team_b_id);
    matchups[team_b_id].add(team_a_id);

    // initialize 0 wins 0 losses
    if (!teamResults[team_a_id]) teamResults[team_a_id] = { wins: 0, losses: 0 };
    if (!teamResults[team_b_id]) teamResults[team_b_id] = { wins: 0, losses: 0 };

    if (team_a_status === 'Win') {
      teamResults[team_a_id].wins += 1;
      teamResults[team_b_id].losses += 1;
    } else if (team_b_status === 'Win') {
      teamResults[team_b_id].wins += 1;
      teamResults[team_a_id].losses += 1;
    }
  });

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

const getGroupings = (seriesList: Series[], teamsList: Team[]) => {
  const { matchups, teamResults } = updateMatchupsAndResults(seriesList);

  const { groupA, groupB } = assignTeamsToGroups(seriesList, matchups);

  return { groupAIds: Array.from(groupA), groupBIds: Array.from(groupB), teamResults };
};

const getTeamStandings = (
  teamIds: string[],
  teamsList: Team[],
  teamResults: Record<string, { wins: number; losses: number }>
) => {
  return teamIds
    .map((teamId) => {
      const team = teamsList.find((t) => t.id === teamId);
      return {
        team,
        wins: teamResults[teamId]?.wins || 0,
        losses: teamResults[teamId]?.losses || 0
      };
    })
    .sort((a, b) => {
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }
      return (a.team?.school_abbrev || '').localeCompare(b.team?.school_abbrev || '');
    });
};

export default function GroupstageView({
  seriesList,
  teamsList,
  platformList
}: GroupstageViewProps) {
  const { groupAIds, groupBIds, teamResults } = getGroupings(seriesList, teamsList);

  const groupA = getTeamStandings(groupAIds, teamsList, teamResults);
  const groupB = getTeamStandings(groupBIds, teamsList, teamResults);

  return (
    <div className="flex flex-col p-4 md:flex-row">
      <div className="w-full p-2 md:w-1/2">
        <h3 className="mb-2 border-b py-4 text-xl dark:border-neutral-700">Group A</h3>
        {groupA ? (
          <ul className="space-y-2">
            {groupA.map(({ team, wins, losses }, index) => (
              <li
                key={team?.id}
                className="flex h-2/4 items-center gap-4 border-b p-4 dark:border-neutral-700"
              >
                <span className="font-bold">{index + 1}</span>
                <Image
                  src={team?.logo_url || not_found}
                  alt={team?.school_abbrev || 'Logo not found'}
                  width={128}
                  height={128}
                  className="h-auto w-8 rounded-full md:w-16"
                />
                <div className="flex flex-col gap-2">
                  <span className="line-clamp-2 text-sm md:text-base">{team?.school_name}</span>
                  <span className="text-xs font-bold dark:text-neutral-400">
                    {wins}W - {losses}L
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No records available</p>
        )}
      </div>

      <div className="w-full p-2 md:w-1/2">
        <h3 className="mb-2 border-b py-4 text-xl dark:border-neutral-700">Group B</h3>
        {groupB ? (
          <ul className="space-y-2">
            {groupB.map(({ team, wins, losses }, index) => (
              <li
                key={team?.id}
                className="flex h-2/4 items-center gap-4 border-b p-4 dark:border-neutral-700"
              >
                <span className="font-bold">{index + 1}</span>
                <Image
                  src={team?.logo_url || not_found}
                  alt={team?.school_abbrev || 'Logo not found'}
                  width={128}
                  height={128}
                  className="h-auto w-8 rounded-full md:w-16"
                />
                <div className="flex flex-col gap-2">
                  <span className="line-clamp-2 text-sm md:text-base">{team?.school_name}</span>
                  <span className="text-xs font-bold dark:text-neutral-400">
                    {wins}W - {losses}L
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No records available</p>
        )}
      </div>
    </div>
  );
}
