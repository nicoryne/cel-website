import { GamePlatform, Team } from "@/lib/types"


export namespace Roles {
    export enum General {
        TeamCaptain = 'Team Captain',
        Flex = 'Flex',
    }

    export enum VALO {
        Controller = 'Controller',
        Duelist = 'Duelist',
        Initiator = 'Initiator',
        Sentinel = 'Sentinel',
    }

    export enum MLBB {
        GoldLaner = 'Gold Laner',
        EXPLaner = 'EXP Laner',
        Roam = 'Roam',
        Jungler = 'Jungler',
        MidLaner = 'Mid Laner',
    }
}

export type Player = {
    id: string; /* PK */
    first_name: string;
    last_name: string;
    ingame_name: string;
    team_id: string;
    game_platform_id: string;
    roles: string[];
    picture_url: string;
}

export type PlayerWithDetails = Omit<Player, 'team_id' | 'game_platform_id'> & {
    team: Team | null;
    platform: GamePlatform | null;
}
