import { GamePlatform, Team } from "@/lib/types"


export type Player = {
    id: string; /* PK */
    first_name: string;
    last_name: string;
    ingame_name: string;
    team_id: string;
    game_platform_id: string;
    roles: string[];
}

export type PlayerWithDetails = Omit<Player, 'team_id' | 'game_platform_id'> & {
    team: Team | null;
    platform: GamePlatform | null;
}
