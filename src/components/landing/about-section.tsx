'use client';
import about_4 from '@/../../public/images/about_4.webp';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { StatInformation, AboutUsData } from '@/components/landing/static';

export default function AboutSection() {
  return (
    <section
      aria-labelledby="about-heading"
      id="about"
      className="min-h-screen bg-white dark:bg-white"
    >
      {/* Content Section */}
      <div>
        {/* Header */}
        <header
          id="about-heading"
          className="mx-auto flex w-[90%] flex-col items-center gap-4 p-4 text-center sm:w-[70%] md:w-[60%]"
        >
          <h2 className="bg-gradient-to-r from-[var(--cel-blue)] to-[var(--cel-red)] bg-clip-text text-6xl font-bold uppercase text-transparent">
            We Forge Legends.
          </h2>
          <p className="text-wrap text-lg text-neutral-500">
            CESAFI Esports League (CEL) is the biggest student-oriented esports
            league in Cebu City, fostering students' talents in-game.
          </p>
        </header>

        {/* Stat Information */}
        <section aria-labelledby="stats-heading" className="p-8">
          <h2 id="stats-heading" className="sr-only">
            Statistical Highlights
          </h2>
          <ul className="flex flex-col flex-wrap place-items-center justify-center gap-8 md:flex-row md:gap-12">
            {StatInformation.map((info, index) => (
              <li key={index}>
                <h3 className="flex h-auto flex-col gap-1 p-4 text-center">
                  <span className="text-5xl font-bold text-neutral-800">
                    {info.heading}
                  </span>
                  <span className="text-sm text-neutral-500 md:text-base">
                    {info.desc}
                  </span>
                </h3>
              </li>
            ))}
          </ul>
        </section>

        {/* About Us */}
        <section
          aria-labelledby="about-us-heading"
          className="flex flex-col bg-[var(--background)]"
        >
          <h2 id="about-us-heading" className="sr-only">
            About Us
          </h2>
          {AboutUsData.map((data, index) => (
            <motion.article
              key={index}
              className="mx-auto grid lg:w-[80vw] lg:grid-cols-2 lg:gap-8 lg:py-8"
              whileInView={{ opacity: [0.6, 1], scale: [0.97, 1] }}
              initial={{ opacity: 0.6, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <figure
                className={`relative ${index % 2 !== 0 ? 'lg:order-2' : ''}`}
              >
                <Image
                  src={data.image}
                  alt={`${data.title} - CESAFI Esports League`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={95}
                  className="h-auto w-full object-cover lg:rounded-lg"
                />
                <figcaption className="absolute bottom-4 left-4">
                  <span className="text-sm font-semibold uppercase text-white shadow-sm">
                    {data.imageDesc}
                  </span>
                </figcaption>
              </figure>
              <div className="col-span-1">
                <div className="flex h-full flex-col justify-center gap-6 bg-neutral-900 px-8 py-16 md:rounded-lg md:p-8">
                  <h3 className="text-2xl font-bold uppercase xl:text-4xl">
                    {data.title}
                  </h3>
                  <p className="text-sm font-light leading-loose xl:text-lg">
                    {data.paragraph}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}

          {/* Join Us */}
          <Link
            href="/"
            className="relative h-64 rounded-md bg-[var(--background)] lg:mx-auto lg:h-96 lg:w-[80vw]"
          >
            <Image
              src={about_4}
              alt="CESAFI Esports League Staff"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={95}
              className="absolute inset-0 h-full w-full object-cover opacity-70 md:rounded-md"
            />
            <div className="relative z-10 flex h-full items-center justify-center">
              <p className="text-center text-4xl font-extrabold uppercase">
                Join the CESAFI Esports Family
              </p>
            </div>
          </Link>
        </section>
      </div>
    </section>
  );
}
