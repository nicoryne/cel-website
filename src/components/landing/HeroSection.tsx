'use client';
import WavesDivider from '@/components/landing/WavesDivider';
import Image from 'next/image';
import cel_logo from '@/../public/logos/cel.webp';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[700px] w-full overflow-hidden bg-gradient-to-b from-[var(--cel-navy)] via-[var(--hero-blue-mid)] to-[var(--hero-blue-end)]"
      aria-labelledby="hero-heading"
    >
      {/* Background Video */}
      <div aria-hidden="true">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute left-0 top-0 object-cover opacity-30"
          style={{ width: '1920px', height: '700px' }}
        >
          <source src="/videos/hero_video.mp4" type="video/mp4" />
        </video>
      </div>
      {/* End of Background Video */}

      {/* Hero Content */}
      <div
        className="absolute inset-0 m-auto flex h-fit flex-col items-center justify-between px-4 text-white md:w-[700px] md:flex-row lg:w-[1000px]"
        role="banner"
      >
        {/* Heading */}
        <header className="mb-4 max-w-full text-center md:text-left">
          <h1
            id="hero-heading"
            className="text-5xl font-bold text-white md:text-6xl"
          >
            CESAFI ESPORTS LEAGUE
          </h1>
          <p className="mt-2 text-xs font-normal text-[var(--text-white)] md:text-base">
            The den of the best esports student athletes
          </p>
        </header>

        {/* Animated Logo */}
        <motion.div
          className="w-80"
          initial={{ y: 0, scale: 0.1 }}
          animate={{
            y: [0, -20, 0],
            scale: 1.0
          }}
          transition={{
            y: {
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut'
            },
            scale: {
              duration: 1.2,
              ease: 'easeOut'
            }
          }}
          role="img"
          aria-label="CESAFI Esports League Logo"
        >
          <Image
            className="h-auto w-full object-contain"
            src={cel_logo}
            alt="CESAFI Esports League Logo"
            priority
          />
        </motion.div>
      </div>
      {/* End of Hero Content */}

      {/* Waves Section Divider */}
      <footer className="absolute bottom-0 w-full">
        <WavesDivider />
      </footer>
      {/* End of Waves Section Divider */}
    </section>
  );
}
