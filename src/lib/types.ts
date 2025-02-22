export interface Team {
  id: string /* PK */;
  created_at: string;
  school_abbrev: string;
  school_name: string;
  team_name: string;
  logo_url: string;
}

export interface TeamFormType {
  school_abbrev: string;
  school_name: string;
  team_name: string;
  logo: File | null;
}

export interface Partner {
  id: string /* PK */;
  created_at: string;
  name: string;
  logo_url: string;
  href: string;
}

export interface PartnerFormType {
  name: string;
  href: string;
  logo: File | null;
}

export interface LeagueSchedule {
  id: string /* PK */;
  created_at: string;
  start_date: Date;
  end_date: Date;
  league_stage: string;
  season_number: number;
  season_type: string;
}

export interface SeasonInfo {
  start_date: Date;
  end_date: Date;
  season_type: string;
  season_number: number;
}

export interface GamePlatform {
  id: string /* PK */;
  created_at: string;
  platform_title: string;
  platform_abbrev: string;
  logo_url: string;
}

export interface GamePlatformFormType {
  platform_title: string;
  platform_abbrev: string;
  logo: File | null;
}

export interface Character {
  id: string /* PK */;
  created_at: string;
  name: string;
  role: string;
  platform_id: string;
}

export interface Series {
  id: string /* PK */;
  created_at: string;
  league_schedule_id: string /* FK */;
  series_type: string;
  team_a_id: string /* FK */;
  team_a_score: number;
  team_a_status: string;
  team_b_id: string /* FK */;
  team_b_score: number;
  team_b_status: string;
  week: number;
  status: string;
  match_number: number;
  platform_id: string /* FK */;
  start_time: Date;
  end_time: Date;
}

export interface SeriesFormType {
  league_schedule: LeagueSchedule /* FK */;
  series_type: string;
  team_a: Team /* FK */;
  team_a_score: number;
  team_a_status: string;
  team_b: Team /* FK */;
  team_b_score: number;
  team_b_status: string;
  week: number;
  status: string;
  match_number: number;
  platform: GamePlatform /* FK */;
  date: string;
  start_time: string;
  end_time: string;
}

export interface Player {
  id: string /* PK */;
  created_at: string;
  first_name: string;
  last_name: string;
  ingame_name: string;
  team_id: string;
  platform_id: string;
  roles: string[];
  league_schedules?: { league_schedule_id: string }[];
  picture_url: string;
  is_active: boolean;
}

export interface PlayerLeagueSchedules {
  league_schedule_id: string[];
}

export interface LeagueSchedulePlayers {
  player_id: string[];
}

export interface PlayerFormType {
  first_name: string;
  last_name: string;
  ingame_name: string;
  team: Team;
  game_platform: GamePlatform;
  roles: string[];
  league_schedules: string[];
  picture: File | null;
  is_active: boolean;
}

export interface ValorantMap {
  id: string /* PK */;
  created_at: string;
  name: string;
  is_active: boolean;
  splash_image_url: string;
}

export interface ValorantMapFormType {
  name: string;
  is_active: boolean;
  splash_image: File | null;
}

export interface ValorantMatch {
  id: string /* PK */;
  created_at: string;
  series_id: string /* FK */;
  map_id: string /* FK */;
  match_duration: string;
  match_number: number;
  team_a_status: string;
  team_a_rounds: number;
  team_b_status: string;
  team_b_rounds: number;
}

export interface MlbbMatch {
  id: string /* PK */;
  created_at: string;
  series_id: string /* FK */;
  match_duration: string;
  match_number: number;
  team_a_status: string;
  team_b_status: string;
}

export interface ValorantMatchesPlayerStats {
  id: string /* PK */;
  created_at: string;
  player_id: string /* FK */;
  match_id: string /* FK */;
  agent_id: string /* FK */;
  acs: number;
  kills: number;
  deaths: number;
  assists: number;
  econ_rating: number;
  first_bloods: number;
  plants: number;
  defuses: number;
  is_mvp: boolean;
}

export interface MlbbMatchesPlayerStats {
  id: string /* PK */;
  created_at: string;
  player_id: string /* FK */;
  match_id: string /* FK */;
  hero_id: string /* FK */;
  rating: number;
  kills: number;
  deaths: number;
  assists: number;
  net_worth: number;
  hero_dmg: number;
  turret_dmg: number;
  dmg_tkn: number;
  teamfight: number;
  lord_slain: number;
  turtle_slain: number;
  is_mvp: boolean;
}

export interface ValorantCompiledStats {
  player: Player /* PK */;
  agent: string /* FK */;
  games: number;
  rounds: number;
  mvps: number;
  acs: number | string;
  kpg: number | string;
  dpg: number | string;
  apg: number | string;
  kpr: number | string;
  dpr: number | string;
  apr: number | string;
  k: number;
  d: number;
  a: number;
  fb: number;
  pl: number;
  df: number;
}

export interface MlbbCompiledStats {
  player: Player /* PK */;
  hero: string /* FK */;
  games: number;
  mvps: number;
  r: number | string;
  kpg: number | string;
  dpg: number | string;
  apg: number | string;
  gld: number;
  hdmg: number;
  tdmg: number;
  dmgt: number;
  tf: number | string;
  k: number;
  d: number;
  a: number;
  ls: number;
  ts: number;
}

export type ValorantMatchesPlayerStatsWithDetails = Omit<
  ValorantMatchesPlayerStats,
  'player_id' | 'match_id' | 'agent_id'
> & {
  player: Player;
  match: ValorantMatch;
  agent: Character;
};

export type MlbbMatchesPlayerStatsWithDetails = Omit<
  MlbbMatchesPlayerStats,
  'player_id' | 'match_id' | 'hero_id'
> & {
  player: Player;
  match: MlbbMatch;
  hero: Character;
};

export type ValorantMatchWithDetails = Omit<ValorantMatch, 'series_id' | 'map_id'> & {
  series: Series;
  map: ValorantMap;
};

export type MlbbMatchWithDetails = Omit<MlbbMatch, 'series_id'> & {
  series: Series;
};

export type PlayerWithDetails = Omit<Player, 'team_id' | 'platform_id'> & {
  team: Team | null;
  platform: GamePlatform | null;
};

export type CharacterWithDetails = Omit<Character, 'platform_id'> & {
  platform: GamePlatform | null;
};

export type SeriesWithDetails = Omit<
  Series,
  'league_schedule_id' | 'team_a_id' | 'team_b_id' | 'platform_id'
> & {
  league_schedule: LeagueSchedule | null;
  team_a: Team | null;
  team_b: Team | null;
  platform: GamePlatform | null;
};
