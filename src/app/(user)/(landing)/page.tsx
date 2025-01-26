import AboutSection from '@/app/(user)/(landing)/_sections/about-section';
import ContactSection from '@/app/(user)/(landing)/_sections/contact-section';
import HeroSection from '@/app/(user)/(landing)/_sections/hero-section';
import SchoolsSection from '@/app/(user)/(landing)/_sections/schools-section';

export default function Home() {
  return (
    <>
      <main>
        <HeroSection />

        <SchoolsSection />

        <AboutSection />

        <ContactSection />
      </main>
    </>
  );
}
