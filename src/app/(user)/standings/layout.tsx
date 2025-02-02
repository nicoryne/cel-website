import { getLatestLeagueSchedule } from '@/api/league-schedule';
import StandingSidebar from '@/app/(user)/standings/_components/sidebar';
import { usePathname } from 'next/navigation';

export default function StandingLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative mt-20 flex flex-col overflow-hidden border-b-2 dark:border-b-neutral-700 md:flex-row">
      <StandingSidebar />
      {children}
    </div>
  );
}
