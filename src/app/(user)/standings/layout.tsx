import { getLatestLeagueSchedule } from '@/api/league-schedule';
import StandingSidebar from '@/app/(user)/standings/_ui/sidebar';
import { usePathname } from 'next/navigation';

export default function StandingLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative mt-20 flex flex-row overflow-hidden border-b-2">
      <StandingSidebar />
      {children}
    </div>
  );
}
