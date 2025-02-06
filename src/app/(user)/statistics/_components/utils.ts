import {
  Character,
  MlbbCompiledStats,
  MlbbMatch,
  MlbbMatchesPlayerStats,
  Player,
  Series,
  ValorantCompiledStats,
  ValorantMatch,
  ValorantMatchesPlayerStats
} from '@/lib/types';

export const processValorantStats = (
  matchStats: ValorantMatchesPlayerStats[],
  matches: ValorantMatch[],
  player: Player,
  characters: Character[]
) => {
  const retrieveRounds = (matches: ValorantMatch[], matchId: string, teamId: string) => {
    let rounds = 0;
    matches.forEach((m) => {
      if (m.id === matchId) {
        rounds += m.team_a_rounds + m.team_b_rounds;
      }
    });
    return rounds;
  };

  const teamId = player.team_id;

  let stats: ValorantCompiledStats = {
    player: player,
    agent: 'No Info',
    games: matchStats.length,
    rounds: 0,
    mvps: 0,
    acs: 0,
    kpg: 0,
    dpg: 0,
    apg: 0,
    kpr: 0,
    dpr: 0,
    apr: 0,
    k: 0,
    d: 0,
    a: 0,
    fb: 0,
    pl: 0,
    df: 0
  };

  if (stats.games === 0) {
    return stats;
  }

  let rounds = 0;
  let acs = 0;
  let agentCount: Record<string, number> = {};
  matchStats.forEach((mStats) => {
    rounds += retrieveRounds(matches, mStats.match_id, teamId);
    acs += mStats.acs;
    stats.k += mStats.kills;
    stats.d += mStats.deaths;
    stats.a += mStats.assists;
    stats.fb += mStats.first_bloods;
    stats.pl += mStats.plants;
    stats.df += mStats.defuses;
    agentCount[mStats.agent_id] = (agentCount[mStats.agent_id] || 0) + 1;
    mStats.is_mvp ? (stats.mvps = stats.mvps + 1) : null;
  });

  stats.rounds = rounds;
  stats.acs = (acs / stats.games).toFixed(1);
  stats.kpg = (stats.k / stats.games).toFixed(1);
  stats.dpg = (stats.d / stats.games).toFixed(1);
  stats.apg = (stats.a / stats.games).toFixed(1);

  stats.kpr = (stats.k / rounds).toFixed(1);
  stats.dpr = (stats.d / rounds).toFixed(1);
  stats.apr = (stats.a / rounds).toFixed(1);

  if (agentCount) {
    const agentId = Object.keys(agentCount).reduce((a, b) =>
      agentCount[a] > agentCount[b] ? a : b
    );

    const agent = characters.find((c) => c.id === agentId);
    stats.agent = agent ? agent.name : 'No Info';
  }
  return stats;
};

export const processMlbbStats = (
  matchStats: MlbbMatchesPlayerStats[],
  player: Player,
  characters: Character[]
) => {
  let stats: MlbbCompiledStats = {
    player: player,
    hero: 'No Info',
    games: matchStats.length,
    mvps: 0,
    r: 0,
    kpg: 0,
    dpg: 0,
    apg: 0,
    gld: 0,
    hdmg: 0,
    tdmg: 0,
    dmgt: 0,
    tf: 0,
    k: 0,
    d: 0,
    a: 0,
    ls: 0,
    ts: 0
  };

  if (stats.games === 0) {
    return stats;
  }

  let rating = 0;
  let teamfight = 0;
  let heroCount: Record<string, number> = {};
  matchStats.forEach((mStats) => {
    rating += mStats.rating;
    teamfight += mStats.teamfight;
    stats.k += mStats.kills;
    stats.d += mStats.deaths;
    stats.a += mStats.assists;
    stats.gld += mStats.net_worth;
    stats.hdmg += mStats.hero_dmg;
    stats.tdmg += mStats.turret_dmg;
    stats.dmgt += mStats.dmg_tkn;
    stats.ls += mStats.lord_slain;
    stats.ts += mStats.turtle_slain;
    heroCount[mStats.hero_id] = (heroCount[mStats.hero_id] || 0) + 1;
    mStats.is_mvp ? (stats.mvps = stats.mvps + 1) : null;
  });

  stats.r = (rating / stats.games).toFixed(1);
  stats.kpg = (stats.k / stats.games).toFixed(1);
  stats.dpg = (stats.d / stats.games).toFixed(1);
  stats.apg = (stats.a / stats.games).toFixed(1);

  stats.tf = (teamfight / stats.games).toFixed(1);

  if (heroCount) {
    const heroId = Object.keys(heroCount).reduce((a, b) => (heroCount[a] > heroCount[b] ? a : b));

    const hero = characters.find((c) => c.id === heroId);
    stats.hero = hero ? hero.name : 'No Info';
  }
  return stats;
};
