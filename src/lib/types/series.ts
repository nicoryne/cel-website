import { GamePlatform, LeagueSchedule, Team } from "@/lib/types";

export enum SeriesType {
  BO2 = 'BO2',
  BO3 = 'BO3',
  BO5 = 'BO5',  
  BO7 = 'BO7',  
}


export type Series = {
    id: string; /* PK */
    league_schedule_id: string; /* FK */
    series_type: string;
    team_a_id: string; /* FK */
    team_a_score: number;
    team_a_status: string;
    team_b_id: string; /* FK */
    team_b_score: number;
    team_b_status: string;
    week: number;
    status: string;
    platform_id: string; /* FK */
    start_time: Date;
    end_time: Date;
}

export type SeriesWithDetails = Omit<Series, 'league_schedule_id' | 'team_a_id' | 'team_b_id' | 'platform_id'> & {
  league_schedule: LeagueSchedule | null;
  team_a: Team | null;
  team_b: Team | null;
  platform: GamePlatform | null;
};