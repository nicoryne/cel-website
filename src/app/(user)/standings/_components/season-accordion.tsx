'use client';

import Accordion from '@/components/ui/accordion';
import AccordionItem from '@/components/ui/accordion-item';
import { SeasonInfo } from '@/lib/types';
import SeasonItem from '@/app/(user)/standings/_components/season-item';
import { usePathname } from 'next/navigation';

interface SeasonAccordionProps {
  seasonsList: SeasonInfo[];
}
export default function SeasonAccordion({ seasonsList }: SeasonAccordionProps) {
  const path = usePathname();

  const match = path?.match(/^\/standings\/([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)/);
  const selectedSeason = seasonsList.find(
    (season) =>
      season.season_type.toLowerCase() === match?.[1]?.toLowerCase() &&
      season.season_number.toString() === match?.[2]
  );

  const accordionVal =
    selectedSeason?.season_type && selectedSeason?.season_number
      ? `${selectedSeason.season_type} ${selectedSeason.season_number}`
      : 'Pick a Season';

  return (
    <Accordion value={accordionVal}>
      {seasonsList.map((season, index) => (
        <AccordionItem key={index}>
          <div className="w-full">
            <SeasonItem season={season} />
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
