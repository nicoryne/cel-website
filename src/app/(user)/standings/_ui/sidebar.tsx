import { getAllLeagueSchedules } from '@/api/league-schedule';
import { SeasonInfo } from '@/lib/types';
import IconCel from '@/../../public/icons/icon_cel.svg';
import Link from 'next/link';

export default async function StandingSidebar() {
  const scheduleList = await getAllLeagueSchedules();

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

  const seasonsList = Array.from(seasonsMap.values());

  return (
    <aside className="h-screen min-w-80 border-r-2 border-neutral-200 bg-background shadow-md dark:border-neutral-700">
      <div className="pt-4">
        <header className="border-b-2 border-neutral-200 px-4 py-8 dark:border-neutral-700">
          <h2>ALL SEASONS</h2>
        </header>
        <ul>
          {seasonsList.map((schedule, index) => (
            <li key={index}>
              <Link href={`/standings/${schedule.season_type.toLowerCase()}/${schedule.season_number}/groupstage`}>
                <div className="border-b-2 border-r-4 border-r-neutral-200 px-4 py-8 opacity-80 hover:border-r-chili hover:bg-neutral-50 hover:opacity-100 active:bg-neutral-100 dark:border-b-neutral-700 dark:border-r-neutral-600 dark:opacity-60 dark:hover:border-r-chili hover:dark:bg-neutral-900 active:dark:bg-neutral-950">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                      <IconCel className="h-auto w-12 fill-foreground" />
                      <h4 className="text-3xl font-bold uppercase">
                        {schedule.season_type} {schedule.season_number}
                      </h4>
                    </div>
                    <time className="text-xs font-normal dark:font-thin md:text-sm">
                      {new Date(schedule.start_date).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}{' '}
                      -{' '}
                      {new Date(schedule.end_date).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </time>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
