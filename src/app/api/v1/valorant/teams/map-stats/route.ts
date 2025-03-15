import { createClient } from '@/lib/supabase/server';
import { Team, ValorantMap } from '@/lib/types';
import { getAllMaps } from '@/services/maps';
import { getAllTeams } from '@/services/team';

interface MapStat {
  map: string;
  wins: number;
  losses: number;
  games: number;
  winrate: number;
}

interface TeamStat {
  team: string;
  maps: MapStat[];
}

interface ValorantMatchStat {
  valorant_maps: { name: string };
  series: {
    team_a: { school_abbrev: string };
    team_b: { school_abbrev: string };
  };
  team_a_status: any;
  team_b_status: any;
}

export async function GET(): Promise<Response> {
  const supabase = createClient();
  const maps = await getAllMaps();
  const teams = await getAllTeams();

  let teamMapStats: TeamStat[] = teams.map((team) => ({
    team: team.school_abbrev,
    maps: maps.map((map) => ({
      map: map.name,
      wins: 0,
      losses: 0,
      games: 0,
      winrate: 0
    }))
  }));

  const updateTeamStats = (
    teamMapStats: TeamStat[],
    teamName: string,
    mapName: string,
    status: string
  ) => {
    const teamStat = teamMapStats.find((t) => t.team === teamName);
    if (teamStat) {
      const mapStat = teamStat.maps.find((m) => m.map === mapName);
      if (mapStat) {
        mapStat.games++;
        if (status === 'Win') {
          mapStat.wins++;
        } else if (status === 'Loss') {
          mapStat.losses++;
        }
      }
    }
  };

  try {
    const { data, error } = (await supabase
      .from('valorant_matches')
      .select(
        `team_a_status,
        team_b_status,
        valorant_maps (name), 
        series!inner (
        league_schedule!inner(*),
        team_a:teams!team_a_id (school_abbrev), 
        team_b:teams!team_b_id (school_abbrev)
        )`
      )
      .in('series.league_schedule.id', [
        'eeeca5ef-5fc8-4077-937b-8db91acda6b4',
        'bb9a49cb-305e-4e53-8ed6-cd8c18cd807c',
        '7cbe290b-2f8c-4963-b118-4ecee10eb31a'
      ])) as unknown as { data: ValorantMatchStat[] | null; error: any };

    console.log(data);
    if (error) {
      throw error;
    }

    if (data) {
      data.map((match) => {
        const mapName = match.valorant_maps.name;

        const teamA = match.series.team_a.school_abbrev;
        const teamAStatus = match.team_a_status;
        const teamB = match.series.team_b.school_abbrev;
        const teamBStatus = match.team_b_status;

        if (mapName && teamA && teamAStatus) {
          updateTeamStats(teamMapStats, teamA, mapName, teamAStatus);
        }

        if (mapName && teamB && teamBStatus) {
          updateTeamStats(teamMapStats, teamB, mapName, teamBStatus);
        }
      });

      teamMapStats.forEach((teamStat) => {
        teamStat.maps.forEach((mapStat) => {
          if (mapStat.games > 0) {
            mapStat.winrate = mapStat.wins / mapStat.games;
          }
        });
      });
    }

    return new Response(JSON.stringify(teamMapStats), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
