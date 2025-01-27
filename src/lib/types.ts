export interface Team {
  id: string /* PK */;
  school_abbrev: string;
  school_name: string;
  logo_url: string;
}

export interface TeamFormType {
  school_abbrev: string;
  school_name: string;
  logo: File | null;
}

export interface LeagueSchedule {
  id: string /* PK */;
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
  name: string;
  role: string;
  platform_id: string;
}

export interface Series {
  id: string /* PK */;
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
  platform: GamePlatform /* FK */;
  date: string;
  start_time: string;
  end_time: string;
}

export interface Player {
  id: string /* PK */;
  first_name: string;
  last_name: string;
  ingame_name: string;
  team_id: string;
  game_platform_id: string;
  roles: string[];
  picture_url: string;
}

export interface PlayerFormType {
  first_name: string;
  last_name: string;
  ingame_name: string;
  team: Team;
  game_platform: GamePlatform;
  roles: string[];
  picture: File | null;
}

export interface ValorantMap {
  id: string /* PK */;
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
  series_id: string /* FK */;
  map_id: string /* FK */;
  match_duration: string;
  match_number: number;
  team_a_status: string;
  team_a_rounds: number;
  team_b_status: string;
  team_b_rounds: number;
}

export interface ValorantMatchesPlayerStats {
  id: string /* PK */;
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
}

export interface ValorantCompiledStats {
  player_id: string /* PK */;
  agent_id: string /* FK */;
  games: number;
  rounds: number;
  acs: number;
  kills: number;
  deaths: number;
  assists: number;
  first_bloods: number;
  plants: number;
  defuses: number;
}

export type ValorantMatchesPlayerStatsWithDetails = Omit<
  ValorantMatchesPlayerStats,
  'player_id' | 'match_id' | 'agent_id'
> & {
  player: Player;
  match: ValorantMatch;
  agent: Character;
};

export type ValorantMatchWithDetails = Omit<ValorantMatch, 'series_id' | 'map_id'> & {
  series: Series;
  map: ValorantMap;
};

export type PlayerWithDetails = Omit<Player, 'team_id' | 'game_platform_id'> & {
  team: Team | null;
  platform: GamePlatform | null;
};

export type CharacterWithDetails = Omit<Character, 'platform_id'> & {
  platform: GamePlatform | null;
};

export type SeriesWithDetails = Omit<Series, 'league_schedule_id' | 'team_a_id' | 'team_b_id' | 'platform_id'> & {
  league_schedule: LeagueSchedule | null;
  team_a: Team | null;
  team_b: Team | null;
  platform: GamePlatform | null;
};
