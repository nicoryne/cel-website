import { GamePlatform } from "@/lib/types";

export type Character = {
    id: string; /* PK */
    name: string;
    role: string;
    logo_url: string;
    platform_id: string;
}

export type CharacterWithDetails = Omit<Character, 'platform_id'> & {
    platform: GamePlatform | null;
}