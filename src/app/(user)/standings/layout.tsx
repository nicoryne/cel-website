import StandingSidebar from '@/app/(user)/standings/_components/sidebar';
import Loading from '@/components/loading';
import { Suspense } from 'react';

export default function StandingLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mt-20 flex h-full min-h-screen flex-col border-b dark:border-b-neutral-700 md:flex-row">
      <div className="min-h-full">
        <StandingSidebar />
      </div>
      <div className="w-full flex-1 overflow-x-auto">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
    </div>
  );
}
