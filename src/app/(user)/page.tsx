import { getAllTeams } from '@/api/team';
import Footer from '@/components/Footer';
import AboutSection from '@/components/landing/AboutSection';
import ContactSection from '@/components/landing/ContactSection';
import HeroSection from '@/components/landing/HeroSection';
import SchoolsSection from '@/components/landing/SchoolsSection';

export default async function Home() {
  const teamList = await getAllTeams();

  return (
    <>
      <HeroSection />

      <SchoolsSection teamList={teamList} />

      <AboutSection />

      <ContactSection />

      <Footer />
    </>
  );
}
