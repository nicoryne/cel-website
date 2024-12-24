'use client';
import AboutCarousel from '@/components/landing/AboutCarousel';

export default function AboutSection() {
  return (
    <section
      aria-labelledby="about-heading"
      id="about"
      className="min-h-screen bg-[var(--cel-red)]"
    >
      {/* Content Section */}
      <div className="flex w-full flex-col items-center justify-center space-y-16 p-6 text-center md:p-12 lg:p-24">
        {/* Header */}
        <header className="mb-6">
          <h1
            id="about-heading"
            className="border-b-2 border-[var(--text-light)] py-4 text-5xl font-bold text-[var(--text-light)]"
          >
            About Us
          </h1>
        </header>
        {/* End of Header */}

        {/* Article */}
        <article className="mb-6 max-w-xl text-justify text-lg text-[var(--text-light)]">
          <p>
            Welcome to the CESAFI Esports League, the den of the best esports
            student athletes in Cebu! We bring together the brightest and most
            dedicated players to compete at the highest level, fostering a
            community of passion, skill, and sportsmanship. Join us as we
            celebrate the competitive spirit of esports and showcase the future
            stars of the gaming world in Cebu.
          </p>
        </article>
        {/* End of Article */}

        {/* End of Footer */}
      </div>
    </section>
  );
}
