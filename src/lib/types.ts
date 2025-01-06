export type Team = {
  id: string /* PK */;
  school_abbrev: string;
  school_name: string;
  logo_url: string;
};

export type LeagueSchedule = {
  id: string /* PK */;
  start_date: string;
  end_date: string;
  league_stage: string;
  season_number: number;
  season_type: string;
};

export type GamePlatform = {
  id: string /* PK */;
  created_at: string;
  platform_title: string;
  platform_abbrev: string;
  logo_url: string;
};

export type Character = {
  id: string /* PK */;
  name: string;
  role: string;
  logo_url: string;
  platform_id: string;
};

export type Series = {
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
  start_time: string;
  end_time: string;
};

export type Player = {
  id: string /* PK */;
  first_name: string;
  last_name: string;
  ingame_name: string;
  team_id: string;
  game_platform_id: string;
  roles: string[];
  picture_url: string;
};

export type PlayerWithDetails = Omit<Player, 'team_id' | 'game_platform_id'> & {
  team: Team | null;
  platform: GamePlatform | null;
};

export type CharacterWithDetails = Omit<Character, 'platform_id'> & {
  platform: GamePlatform | null;
};

export type SeriesWithDetails = Omit<
  Series,
  | 'league_schedule_id'
  | 'team_a_id'
  | 'team_b_id'
  | 'platform_id'
  | 'start_time'
  | 'end_time'
> & {
  league_schedule: LeagueSchedule | null;
  team_a: Team | null;
  team_b: Team | null;
  platform: GamePlatform | null;
  start_time: Date;
  end_time: Date;
};
