import { Series, Team } from '@/lib/types';
import { getTeamRoundDiff } from '@/services/valorant-match';
import { getVictoryAverageMatchDuration } from '@/services/mlbb-match';
import { group } from 'console';

export interface GroupStanding {
  team?: Team | undefined;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  roundDiff?: number;
  matchDuration?: string;
}

export const updateMatchupsAndResults = async (
  seriesList: Series[],
  isValorant: boolean,
  leagueScheduleId: string
) => {
  const matchups: Record<string, Set<string>> = {};
  const teamResults: Record<string, GroupStanding> = {};
  const headToHeadWins: Record<string, Record<string, number>> = {};

  for (const {
    team_a_id,
    team_b_id,
    team_a_status,
    team_b_status,
    team_a_score,
    team_b_score
  } of seriesList) {
    if (!matchups[team_a_id]) matchups[team_a_id] = new Set();
    if (!matchups[team_b_id]) matchups[team_b_id] = new Set();

    matchups[team_a_id].add(team_b_id);
    matchups[team_b_id].add(team_a_id);

    if (!teamResults[team_a_id])
      teamResults[team_a_id] = { wins: 0, losses: 0, draws: 0, points: 0, roundDiff: 0 };
    if (!teamResults[team_b_id])
      teamResults[team_b_id] = { wins: 0, losses: 0, draws: 0, points: 0, roundDiff: 0 };

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

    if (!headToHeadWins[team_a_id]) headToHeadWins[team_a_id] = {};
    if (!headToHeadWins[team_b_id]) headToHeadWins[team_b_id] = {};

    if (!headToHeadWins[team_a_id][team_b_id]) headToHeadWins[team_a_id][team_b_id] = 0;
    if (!headToHeadWins[team_b_id][team_a_id]) headToHeadWins[team_b_id][team_a_id] = 0;

    if (team_a_status === 'Win') {
      headToHeadWins[team_a_id][team_b_id] += 1;
    } else if (team_b_status === 'Win') {
      headToHeadWins[team_b_id][team_a_id] += 1;
    }

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
    } else {
      try {
        const [teamAMatchDuration, teamBMatchDuration] = await Promise.all([
          getVictoryAverageMatchDuration(team_a_id, leagueScheduleId),
          getVictoryAverageMatchDuration(team_b_id, leagueScheduleId)
        ]);

        teamResults[team_a_id].matchDuration = teamAMatchDuration || undefined;
        teamResults[team_b_id].matchDuration = teamBMatchDuration || undefined;
      } catch (error) {
        console.error(`Error fetching match durration: ${error}`);
      }
    }
  }

  return { matchups, teamResults, headToHeadWins };
};

export const getTeamStandings = (
  teamIds: string[],
  teamsList: Team[],
  teamResults: Record<string, GroupStanding>
): GroupStanding[] => {
  return teamIds
    .map((teamId) => {
      const team = teamsList.find((t) => t.id === teamId);
      return {
        team,
        wins: teamResults[teamId]?.wins || 0,
        losses: teamResults[teamId]?.losses || 0,
        draws: teamResults[teamId]?.draws || 0,
        points: teamResults[teamId]?.points || 0,
        roundDiff: teamResults[teamId]?.roundDiff || 0,
        matchDuration: teamResults[teamId]?.matchDuration || '00:00'
      };
    })
    .sort((a, b) => {
      return b.points - a.points;
    });
};

export const resolveTieBreakers = (
  groupStanding: GroupStanding[],
  headToHeadWins: Record<string, Record<string, number>>,
  tiedPoints: number[]
): GroupStanding[] => {
  const tiedTeams = groupStanding.filter(({ points }) => tiedPoints.includes(points));
  const nonTiedTeams = groupStanding.filter(({ points }) => !tiedPoints.includes(points));

  const headToHeadPoints: Record<string, number> = tiedTeams.reduce(
    (acc, team) => {
      const teamId = team.team?.id || '';
      acc[teamId] = tiedTeams.reduce((total, opponent) => {
        const opponentId = opponent.team?.id || '';
        if (teamId !== opponentId) {
          total += headToHeadWins[teamId]?.[opponentId] || 0;
        }
        return total;
      }, 0);
      return acc;
    },
    {} as Record<string, number>
  );

  const getSeconds = (duration: string) => {
    const [minutes, seconds] = duration.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  const resolvedTiedTeams = tiedTeams.sort((a, b) => {
    const teamA = a.team?.id || '';
    const teamB = b.team?.id || '';

    const headToHeadA = headToHeadPoints[teamA] || 0;
    const headToHeadB = headToHeadPoints[teamB] || 0;

    if (headToHeadA !== headToHeadB) {
      return headToHeadB - headToHeadA;
    }

    if (a.roundDiff && b.roundDiff) {
      const roundDiffA = a.roundDiff || 0;
      const roundDiffB = b.roundDiff || 0;

      return roundDiffB - roundDiffA;
    }

    if (a.matchDuration && b.matchDuration) {
      const durationA = getSeconds(a.matchDuration);
      const durationB = getSeconds(b.matchDuration);

      return durationA - durationB;
    }

    return b.points - a.points;
  });

  return [...nonTiedTeams, ...resolvedTiedTeams].sort((a, b) => b.points - a.points);
};

export const checkTie = (groupStanding: GroupStanding[]) => {
  const pointsFrequency: Record<number, number> = {};
  const tiedPoints: number[] = [];

  groupStanding.forEach(({ points }) => {
    pointsFrequency[points] = (pointsFrequency[points] || 0) + 1;
  });

  for (const [point, count] of Object.entries(pointsFrequency)) {
    if (count > 1) {
      tiedPoints.push(Number(point));
    }
  }

  return {
    hasTie: tiedPoints.length > 0,
    tiedPoints
  };
};
