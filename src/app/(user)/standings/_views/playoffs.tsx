import { Series, Team } from '@/lib/types';
import PlayoffsMatchup from './playoffs-matchup';

// If there's 8 matches in playoffs
// Then order is
// Match 1: Upper-Bracket Semifinals
// Match 2: Upper-Bracket Semifinals (2)
// Match 3: Lower-Bracket Round 1
// Match 4: Lower-Bracket Round 1 (2)
// Match 5: Lower-Bracket Semifinals
// Match 6: Upper-Bracket Finals
// Match 7: Lower-Bracket Finals
// Match 8: Finals

// If there's 10 matches in playoffs
// Then order is
// Match 1: Upper-Bracket Semifinals
// Match 2: Upper-Bracket Semifinals (2)
// Match 3: Lower-Bracket Round 1
// Match 4: Lower-Bracket Round 1 (2)
// Match 5: Lower-Bracket Round 2
// Match 6: Lower-Bracket Round 2 (2)
// Match 7: Lower-Bracket Semifinals
// Match 8: Upper-Bracket Finals
// Match 9: Lower-Bracket Finals
// Match 10: Finals

interface PlayoffsViewProps {
  seriesList: Series[];
  teamsList: Team[];
}

export default function PlayoffsView({ seriesList, teamsList }: PlayoffsViewProps) {
  seriesList = seriesList.sort((a, b) => a.match_number - b.match_number);
  return (
    <div className={`grid grid-rows-4 gap-16 overflow-x-scroll p-8`}>
      {seriesList.map((series) => (
        <PlayoffsMatchup
          team_a={teamsList.find((t) => t.id === series.team_a_id)!}
          team_b={teamsList.find((t) => t.id === series.team_b_id)!}
          team_a_score={series.team_a_score}
          team_b_score={series.team_b_score}
          team_a_status={series.team_a_status}
          team_b_status={series.team_b_status}
        />
      ))}
    </div>
  );
}
