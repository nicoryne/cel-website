import { getAllGamePlatforms } from "@/api/game-platform";
import { getMlbbMatchBySeries } from "@/api/mlbb-match";
import { getMlbbMatchPlayerStatByMatch } from "@/api/mlbb-match-player-stat";
import { getPlayerById, getPlayersByTeamAndPlatform } from "@/api/player";
import { getLatestSeries } from "@/api/series"
import { getTeamById } from "@/api/team";
import { getValorantMatchBySeries } from "@/api/valorant-match";
import { getValorantMatchPlayerStatByMatchId } from "@/api/valorant-match-player-stat";
import { MlbbMatchesPlayerStats, ValorantMatchesPlayerStats } from "@/lib/types";

interface PlayerStats {
    totalRating: number;
    matchCount: number;
    totalKills: number;
    totalDeaths: number;
    totalAssists: number;
    totalTeamfight: number;
    totalHeroDmg: number;
    totalTurrDmg: number;
    totalDmgTkn: number;
    totalLordSlain: number;
    totalTurtleSlain: number;
}

interface PlayerAcs {
    totalAcs: number;
    matchCount: number;
    totalKills: number;
    totalDeaths: number;
    totalAssists: number;
    totalPlants: number;
    totalDefuses: number;
    totalFirstBloods: number;
}

export default async function MatchMvpPage() {
    // Get latest series
    const platforms = await getAllGamePlatforms();
    const latestSeries = await getLatestSeries();

    const mlbbPlatform = platforms.find((p) => p.platform_abbrev === 'MLBB');
    const valoPlatform = platforms.find((p) => p.platform_abbrev === 'VALO');

    let teamA = null
    let teamB = null
    let winningTeam = null

    if (latestSeries) {
        teamA = await getTeamById(latestSeries?.team_a_id);
        teamB = await getTeamById(latestSeries?.team_b_id);


        if (latestSeries?.team_a_score > latestSeries?.team_b_score) {
            winningTeam = teamA
        } else if (latestSeries?.team_b_score > latestSeries?.team_a_score) {
            winningTeam = teamB
        }
    }


    let valoMvp = { playerTitle: "", averageAcs: 0, totalKills: 0, totalDeaths: 0, totalAssists: 0, totalPlants: 0, totalDefuses: 0, totalFirstBloods: 0, averageKills: '0', averageDeaths: '0', averageAssists: '0', averagePlants: '0', averageDefuses: '0', averageFirstBloods: '0' };
    let mlbbMvp = { playerTitle: "", averageRating: 0, totalKills: 0, totalDeaths: 0, totalAssists: 0, totalHeroDmg: 0, totalDmgTkn: 0, totalTurrDmg: 0, averageTeamfight: '0', totalLordSlain: 0, totalTurtleSlain: 0, averageKills: '0', averageDeaths: '0', averageAssists: '0', averageHeroDmg: '0', averageDmgTkn: '0', averageTurrDmg: '0' };


    if (!latestSeries) {
        return <p>No series found..</p>
    }

    // Initialize variables
    let matches = [];
    let players = [];
    let playerMatchStat: (ValorantMatchesPlayerStats | MlbbMatchesPlayerStats)[] = [];

    if (latestSeries?.platform_id === mlbbPlatform?.id) {
        // Fetch MLBB match stats
        matches = await getMlbbMatchBySeries(latestSeries?.id);

        const teamAPlayers = await getPlayersByTeamAndPlatform(latestSeries.team_a_id, mlbbPlatform.id);
        const teamBPlayers = await getPlayersByTeamAndPlatform(latestSeries.team_b_id, mlbbPlatform.id);

        players = [teamAPlayers, teamBPlayers];

        // Fetch player stats for each match
        const allMatchesStats: MlbbMatchesPlayerStats[] = [];
        for (const match of matches) {
            const matchStats = await getMlbbMatchPlayerStatByMatch(match.id);
            allMatchesStats.push(...matchStats);
        }

        // Calculate average rating for each player in MLBB
        const playerRatings: Record<string, PlayerStats> = allMatchesStats.reduce((acc, stat) => {
            if (!acc[stat.player_id]) {
                acc[stat.player_id] = { totalRating: 0, matchCount: 0, totalKills: 0, totalDeaths: 0, totalAssists: 0, totalHeroDmg: 0, totalDmgTkn: 0, totalTeamfight: 0, totalLordSlain: 0, totalTurrDmg: 0, totalTurtleSlain: 0 };
            }
            acc[stat.player_id].totalRating += stat.rating;
            acc[stat.player_id].matchCount += 1;
            acc[stat.player_id].totalKills += stat.kills
            acc[stat.player_id].totalAssists += stat.assists
            acc[stat.player_id].totalDeaths += stat.deaths
            acc[stat.player_id].totalHeroDmg += stat.hero_dmg
            acc[stat.player_id].totalTurrDmg += stat.turret_dmg
            acc[stat.player_id].totalDmgTkn += stat.dmg_tkn
            acc[stat.player_id].totalTeamfight += stat.teamfight;
            acc[stat.player_id].totalLordSlain += stat.lord_slain
            acc[stat.player_id].totalTurtleSlain += stat.turtle_slain
            return acc;
        }, {} as Record<string, PlayerStats>);

        // Calculate average rating for each player and find MVP
        for (const playerId in playerRatings) {
            const player = await getPlayerById(playerId);
            const team = teamA?.id === player?.team_id ? teamA : teamB

            if(winningTeam != null && team != winningTeam) {
                continue
            }
            const { totalRating, matchCount, totalKills, totalDeaths, totalAssists, totalDmgTkn, totalHeroDmg, totalTurrDmg, totalTeamfight, totalLordSlain, totalTurtleSlain } = playerRatings[playerId];
            const averageRating = totalRating / matchCount;
            if (averageRating > mlbbMvp.averageRating) {
                const averageKills = (totalKills / matchCount).toFixed(2);
                const averageDeaths = (totalDeaths / matchCount).toFixed(2);
                const averageAssists = (totalAssists / matchCount).toFixed(2);
                const averageHeroDmg = (totalHeroDmg / matchCount).toFixed(2);
                const averageTurrDmg = (totalTurrDmg / matchCount).toFixed(2);
                const averageDmgTkn = (totalDmgTkn / matchCount).toFixed(2);
                const averageTeamfight = (totalTeamfight / matchCount).toFixed(2);

                const playerTitle = `${team?.school_abbrev} ${player?.ingame_name}`
                
                mlbbMvp = { playerTitle, averageRating, totalKills, totalDeaths, totalAssists, totalTurrDmg, totalDmgTkn, totalLordSlain, totalTurtleSlain, totalHeroDmg, averageKills, averageAssists, averageDeaths, averageDmgTkn, averageHeroDmg, averageTeamfight, averageTurrDmg };
            }
        }

        console.log("MLBB MVP:", mlbbMvp);

    } else if (latestSeries?.platform_id === valoPlatform?.id) {
        // Fetch Valorant match stats
        matches = await getValorantMatchBySeries(latestSeries?.id);

        const teamAPlayers = await getPlayersByTeamAndPlatform(latestSeries.team_a_id, valoPlatform.id);
        const teamBPlayers = await getPlayersByTeamAndPlatform(latestSeries.team_b_id, valoPlatform.id);

        players = [teamAPlayers, teamBPlayers];

        // Fetch player stats for each match
        const allMatchesStats: ValorantMatchesPlayerStats[] = [];
        for (const match of matches) {
            const matchStats = await getValorantMatchPlayerStatByMatchId(match.id);
            allMatchesStats.push(...matchStats);
        }

        // Calculate average ACS for each player in Valorant
        const playerAcs: Record<string, PlayerAcs> = allMatchesStats.reduce((acc, stat) => {
            if (!acc[stat.player_id]) {
                acc[stat.player_id] = { totalAcs: 0, matchCount: 0, totalKills: 0, totalDeaths: 0,  totalAssists: 0, totalFirstBloods: 0, totalDefuses: 0, totalPlants: 0};
            }
            acc[stat.player_id].totalAcs += stat.acs;
            acc[stat.player_id].matchCount += 1;
            acc[stat.player_id].totalKills += stat.kills
            acc[stat.player_id].totalDeaths += stat.deaths
            acc[stat.player_id].totalAssists += stat.assists
            acc[stat.player_id].totalFirstBloods += stat.first_bloods
            acc[stat.player_id].totalPlants += stat.plants
            acc[stat.player_id].totalDefuses += stat.defuses
            return acc;
        }, {} as Record<string, PlayerAcs>);

        // Calculate average ACS for each player and find MVP

        for (const playerId in playerAcs) {
            const player = await getPlayerById(playerId);
            const team = teamA?.id === player?.team_id ? teamA : teamB

            if(winningTeam != null && team != winningTeam) {
                continue
            }

            const { totalAcs, matchCount, totalKills, totalDeaths, totalAssists, totalFirstBloods, totalPlants, totalDefuses } = playerAcs[playerId];
            const averageAcs = totalAcs / matchCount;
            if (averageAcs > valoMvp.averageAcs) {
                const averageKills = (totalKills / matchCount).toFixed(2)
                const averageDeaths = (totalDeaths / matchCount).toFixed(2)
                const averageAssists = (totalAssists / matchCount).toFixed(2)
                const averageFirstBloods = (totalFirstBloods / matchCount).toFixed(2)
                const averagePlants = (totalPlants / matchCount).toFixed(2);
                const averageDefuses = (totalDefuses / matchCount).toFixed(2);

                const playerTitle = `${team?.school_abbrev} ${player?.ingame_name}`

                valoMvp = { playerTitle, averageAcs, totalKills, totalDeaths, totalAssists, totalFirstBloods, totalDefuses, totalPlants, averageKills, averageDeaths, averageAssists, averageFirstBloods, averageDefuses, averagePlants};
            }
        }

        console.log("Valorant MVP:", valoMvp);
    }

    // Return MVP stats (You can customize the display)
    return (
        <div className="flex flex-col gap-8">
            {mlbbMvp && mlbbMvp.playerTitle && (
                <div>
                    <h2>MLBB MVP: {mlbbMvp.playerTitle}</h2>
                    <ul>
                        {Object.entries(mlbbMvp)
                            .map(([key, value]) => (
                                <li key={key}>
                                    <strong>{key.replace(/([A-Z])/g, " $1").trim()}:</strong> {value}
                                </li>
                            ))}
                    </ul>
                </div>
            )}

            {valoMvp && valoMvp.playerTitle && (
                <div>
                    <h2>Valorant MVP: {valoMvp.playerTitle}</h2>
                    <ul>
                        {Object.entries(valoMvp)
                            .map(([key, value]) => (
                                <li key={key}>
                                    <strong>{key.replace(/([A-Z])/g, " $1").trim()}:</strong> {value}
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

