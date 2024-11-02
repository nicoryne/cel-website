export type LeagueSchedule = {
    id: string; /* PK */
    start_date: Date;
    end_date: Date;
    league_stage: string;
    season_number: number;
    season_type: string;
    is_active: boolean;
};