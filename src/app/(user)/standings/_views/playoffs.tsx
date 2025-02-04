'use client';
import React, { useState, useRef } from 'react';
import { Series, Team } from '@/lib/types';
import PlayoffsMatchup from '@/app/(user)/standings/_views/playoffs-matchup';

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

const EIGHT_MATCHES = {
  upperBracket: {
    0: { title: 'Upper Bracket Quarterfinals', matches: [1, 2] },
    1: { title: '', matches: [] },
    2: { title: 'Upper Bracket Semifinals', matches: [6] },
    3: { title: 'Grand Finals', matches: [8] }
  },
  lowerBracket: {
    0: { title: 'Lower Bracket Round 1', matches: [3, 4] },
    1: { title: 'Lower Bracket Quarterfinals', matches: [5] },
    2: { title: 'Lower Bracket Semifinals', matches: [7] },
    3: { title: '', matches: [] }
  }
};

const TEN_MATCHES = {
  upperBracket: {
    0: { title: '', matches: [] },
    1: { title: 'Upper Bracket Quarterfinals', matches: [1, 2] },
    2: { title: '', matches: [] },
    3: { title: 'Upper Bracket Semifinals', matches: [7] },
    4: { title: 'Grand Finals', matches: [10] }
  },
  lowerBracket: {
    0: { title: 'Lower Bracket Round 1', matches: [3, 4] },
    1: { title: 'Lower Bracket Round 2', matches: [5, 6] },
    2: { title: 'Lower Bracket Quarterfinals', matches: [8] },
    3: { title: 'Lower Bracket Semifinals', matches: [9] },
    4: { title: '', matches: [] }
  }
};

export default function PlayoffsView({ seriesList, teamsList }: PlayoffsViewProps) {
  console.log(seriesList);
  console.log(teamsList);
  seriesList = seriesList.sort((a, b) => a.match_number - b.match_number);
  const bracketView = seriesList.length === 10 ? TEN_MATCHES : EIGHT_MATCHES;
  const columns = seriesList.length / 2;

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <>
      {seriesList.length === 0 ? (
        <p className="p-16">No records available.</p>
      ) : (
        <>
          <div
            ref={containerRef}
            className="no-scrollbar overflow-x-scroll"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
            onMouseUp={handleMouseUp}
          >
            <div className="relative space-y-12 p-8" style={{ width: `calc(26rem*${columns})` }}>
              {/* Upper Bracket */}
              <div className="flex w-full">
                {Object.entries(bracketView.upperBracket).map(
                  ([columnIndex, { title, matches }]) => {
                    console.log(matches);
                    return (
                      <div
                        key={columnIndex}
                        style={{ minWidth: `calc(100%/${columns})` }}
                        className="mr-20 flex select-none flex-col justify-center gap-4"
                      >
                        {title && <h4 className="font-extrabold">{title}</h4>}

                        {matches.map((matchNumber) => {
                          const series = seriesList.find((s) => s.match_number === matchNumber);
                          if (!series) return null;

                          const team_a =
                            teamsList.find((t) => t.id === series.team_a_id) || teamsList[0];
                          const team_b =
                            teamsList.find((t) => t.id === series.team_b_id) || teamsList[0];

                          return (
                            <PlayoffsMatchup
                              key={series.match_number}
                              team_a={team_a}
                              team_b={team_b}
                              team_a_status={series.team_a_status}
                              team_b_status={series.team_b_status}
                              team_a_score={series.team_a_score}
                              team_b_score={series.team_b_score}
                            />
                          );
                        })}
                      </div>
                    );
                  }
                )}
              </div>
              {/* Lower Bracket */}
              <div className="flex w-full">
                {Object.entries(bracketView.lowerBracket).map(
                  ([columnIndex, { title, matches }], index) => (
                    <div
                      key={columnIndex}
                      style={{ minWidth: `calc(100%/${columns})` }}
                      className="mr-20 flex select-none flex-col justify-center gap-4"
                    >
                      {title && <h4 className="font-extrabold">{title}</h4>}

                      {matches.map((matchNumber) => {
                        const series = seriesList.find((s) => s.match_number === matchNumber);
                        if (!series) return null;

                        const team_a =
                          teamsList.find((t) => t.id === series.team_a_id) || teamsList[0];
                        const team_b =
                          teamsList.find((t) => t.id === series.team_b_id) || teamsList[0];

                        return (
                          <PlayoffsMatchup
                            key={series.match_number}
                            team_a={team_a}
                            team_b={team_b}
                            team_a_status={series.team_a_status}
                            team_b_status={series.team_b_status}
                            team_a_score={series.team_a_score}
                            team_b_score={series.team_b_score}
                          />
                        );
                      })}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
