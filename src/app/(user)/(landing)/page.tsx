import AboutSection from '@/app/(user)/(landing)/_sections/about-section';
import ContactSection from '@/app/(user)/(landing)/_sections/contact-section';
import HeroSection from '@/app/(user)/(landing)/_sections/hero-section';
import SchoolsSection from '@/app/(user)/(landing)/_sections/schools-section';
import PartnersSection from './_sections/partners-section';

export default function Home() {
  return (
    <>
      <main>
        <HeroSection />

        <SchoolsSection />

        <PartnersSection />

        <AboutSection />

        <ContactSection />
      </main>
    </>
  );
}
