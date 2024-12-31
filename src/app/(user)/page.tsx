import { getAllTeams } from '@/api/team';
import AboutSection from '@/components/landing/AboutSection';
import ContactSection from '@/components/landing/ContactSection';
import HeroSection from '@/components/landing/HeroSection';
import SchoolsSection from '@/components/landing/SchoolsSection';

export default async function Home() {
  const teamList = await getAllTeams();

  return (
    <main>
      <HeroSection />

      <SchoolsSection teamList={teamList} />

      <AboutSection />
    </main>
  );
}
