'use client';
import React from 'react';
import WavesDivider from '@/components/landing/WavesDivider';
import Image from 'next/image';
import cel_logo from '@/../public/logos/cel.webp';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const [showVideo, setShowVideo] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowVideo(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      aria-labelledby="hero-heading"
      id="home"
      className="relative min-h-[700px] w-full overflow-hidden bg-gradient-to-b from-[var(--cel-navy)] via-[var(--hero-blue-mid)] to-[var(--hero-blue-end)]"
    >
      {/* Background Video */}
      <div aria-hidden="true">
        {showVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute left-0 top-0 h-[700px] w-[1920px] object-cover opacity-30"
            poster="/images/about_4.webp"
          >
            <source src="/videos/hero_video.mp4" type="video/mp4" />
          </video>
        ) : (
          <Image
            src="/images/about_4.webp"
            alt="Hero Section Placeholder"
            className="absolute left-0 top-0 h-[700px] w-[1920px] object-cover opacity-30"
            loading="lazy"
            priority
            width={1920}
            height={700}
            quality={50}
          />
        )}
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
          initial={{ y: 0 }}
          animate={{
            y: [0, -20, 0]
          }}
          transition={{
            y: {
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut'
            }
          }}
          role="img"
          aria-label="CESAFI Esports League Logo"
        >
          <Image
            className="h-auto w-80 object-contain"
            src={cel_logo}
            alt="CESAFI Esports League Logo"
            width={300}
            height={300}
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
