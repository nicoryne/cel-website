import { GamePlatform, Series, Team } from '@/lib/types';
import Image from 'next/image';
import not_found from '@/../../public/images/not-found.webp';

interface GroupstageViewProps {
  seriesList: Series[];
  teamsList: Team[];
}

const updateMatchupsAndResults = (seriesList: Series[]) => {
  const matchups: Record<string, Set<string>> = {};
  const teamResults: Record<string, { wins: number; losses: number }> = {};

  seriesList.forEach(({ team_a_id, team_b_id, team_a_status, team_b_status }) => {
    if (!matchups[team_a_id]) matchups[team_a_id] = new Set();
    if (!matchups[team_b_id]) matchups[team_b_id] = new Set();

    matchups[team_a_id].add(team_b_id);
    matchups[team_b_id].add(team_a_id);

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

const getDistinctTeamIds = (seriesList: Series[]): string[] => {
  const teamIds = new Set<string>();

  seriesList.forEach(({ team_a_id, team_b_id }) => {
    teamIds.add(team_a_id);
    teamIds.add(team_b_id);
  });

  return Array.from(teamIds);
};

export default function PlayinsView({ seriesList, teamsList }: GroupstageViewProps) {
  const teamIds = getDistinctTeamIds(seriesList);
  const { teamResults } = updateMatchupsAndResults(seriesList);
  let teamStandings = getTeamStandings(teamIds, teamsList, teamResults);

  if (teamStandings.length === 1) {
    while (teamStandings.length < 4) {
      teamStandings.push({ ...teamStandings[0] });
    }
  }

  return (
    <div className="flex flex-col p-4">
      <div className="w-full p-2">
        <h3 className="mb-2 border-b py-4 text-xl dark:border-neutral-700">Play-ins Standing</h3>
        {teamStandings ? (
          <ul className="space-y-2">
            {teamStandings.map(({ team, wins, losses }, index) => (
              <li
                key={index}
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
                  <span className="text-sm">{team?.school_name}</span>
                  <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
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
