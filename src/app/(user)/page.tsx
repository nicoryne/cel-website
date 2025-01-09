import AboutSection from '@/components/landing/about-section';
import ContactSection from '@/components/landing/contact-section';
import HeroSection from '@/components/landing/hero-section';
import SchoolsSection from '@/components/landing/schools-section';
import Loading from '@/components/loading';
import { Suspense } from 'react';
import { getAllTeams } from '@/api/team';

export default function Home() {
  const teams = getAllTeams();

  return (
    <main>
      <HeroSection />

      <Suspense fallback={<Loading />}>
        <SchoolsSection teams={teams} />
      </Suspense>

      <AboutSection />

      <ContactSection />
    </main>
  );
}
