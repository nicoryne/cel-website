import { getAllLeagueSchedules } from '@/api/league-schedule';
import { SeasonInfo } from '@/lib/types';
import SeasonItem from '@/app/(user)/standings/_components/season-item';
import SeasonAccordion from './season-accordion';
import { getAllGamePlatforms } from '@/api/game-platform';
import Dropdown from '@/components/ui/dropdown';

export default async function StandingSidebar() {
  const scheduleList = await getAllLeagueSchedules();
  const platformList = await getAllGamePlatforms();
  const seasonsMap = new Map<string, SeasonInfo>();

  scheduleList.forEach((schedule) => {
    const key = `${schedule.season_type}-${schedule.season_number}`;

    if (!seasonsMap.has(key)) {
      seasonsMap.set(key, {
        start_date: schedule.start_date,
        end_date: schedule.end_date,
        season_type: schedule.season_type,
        season_number: schedule.season_number
      });
    } else {
      const seasonInfo = seasonsMap.get(key);

      if (seasonInfo) {
        if (schedule.start_date < seasonInfo.start_date) {
          seasonInfo.start_date = schedule.start_date;
        }

        if (schedule.end_date > seasonInfo.end_date) {
          seasonInfo.end_date = schedule.end_date;
        }
      }
    }
  });

  const seasonsList = Array.from(seasonsMap.values()).sort((a, b) => {
    return a.start_date < b.start_date ? 1 : -1;
  });

  return (
    <aside className="h-24 w-full bg-background shadow-md md:h-screen md:w-80 md:border-r md:border-neutral-200 md:dark:border-neutral-700">
      <div className="hidden pt-4 md:block">
        <header className="hidden h-24 border-b border-neutral-200 px-4 dark:border-neutral-700 md:block"></header>
        <ul>
          {seasonsList.map((season, index) => (
            <li key={index}>
              <SeasonItem season={season} />
            </li>
          ))}
        </ul>
      </div>

      <div className="flex h-full w-full md:hidden">
        <SeasonAccordion seasonsList={seasonsList} />
      </div>
    </aside>
  );
}
