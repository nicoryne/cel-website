

export type LeagueSchedule = {
  id: string; /* PK */
  start_date: Date;
  end_date: Date;
  league_stage: string;
  season_number: number;
  season_type: string;
  is_active: boolean;
};

export type Team = {
  id: string;
  team_name: string;
  school_abbrev: string;
  school_name: string;
  logo_url: string;
}

export type GamePlatform = {
    id: string; /* PK */
    created_at: Date;
    platform_title: string;
    platform_abbrev: string;
    logo_url: string;
}

export type Series = {
    id: string; /* PK */
    league_schedule_id: string; /* FK */
    series_date: Date;
    series_type: string;
    team_a_id: string; /* FK */
    team_a_score: number;
    team_a_status: string;
    team_b_id: string; /* FK */
    team_b_score: number;
    team_b_status: string;
    week: number;
    is_live: boolean;
    platform_id: string; /* FK */
    start_time: Date;
    end_time: Date;
}

export type SeriesWithDetails = Omit<Series, 'league_schedule_id' | 'team_a_id' | 'team_b_id' | 'platform_id'> & {
  league_schedule: LeagueSchedule;
  team_a: Team;
  team_b: Team;
  platform: GamePlatform;
};




