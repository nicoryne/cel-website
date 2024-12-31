'use client';
import about_1 from '@/../../public/images/about_1.webp';
import about_2 from '@/../../public/images/about_2.webp';
import about_3 from '@/../../public/images/about_3.webp';
import about_4 from '@/../../public/images/about_4.webp';
import Image from 'next/image';
import Link from 'next/link';

const statInformation = [
  { heading: '300+', desc: 'Student Volunteers' },
  { heading: '1000+', desc: 'Student Athletes' },
  { heading: '12M+', desc: 'Reach' }
];

const aboutUsData = [
  {
    image: about_1,
    title: 'Humble Beginnings',
    paragraph: `The Cebu Schools Athletic Foundation, Inc. (CESAFI) Esports
                  League (CEL) officially inaugurated back in December 2022
                  after three years of preparation. With the support of CESAFI
                  commissioner Felix Tiukinhoy Jr., and the initiative of now
                  CESAFI Executive Director Ryan Balbuena, the league has become
                  the premier collegiate esports competition in Cebu.`
  },
  {
    image: about_2,
    title: 'Forging Legends',
    paragraph: `As a collegiate esports competition, the league is more than a
                platform for esports student-athletes to showcase their skills,
                the league has taken steps to ensure that the players are
                responsible in-game and in their studies. Student-athletes
                maintain a balanced school-work ethic to be able to compete in
                the league; forging legends in-game without compromising
                academic responsibilities.`
  },
  {
    image: about_3,
    title: 'For students, by students',
    paragraph: `The organization started as and maintains itself in being a
                  student-led esports community, where student volunteers are
                  operating each department in the CEL. As explained by
                  CESAFI Executive Director, Ryan Balbuena, the league is not
                  only a platform for student-athletes to test their skills but
                  also a platform for student volunteers to develop their skills
                  in esports production, including esports broadcasting and
                  organizing esports events. 
                  
                  Furthermore, the CEL is under the
                  supervision of the Athletic Directors of CESAFI member
                  schools, and student-athletes representing their respective
                  schools are supported by their institutions.`
  }
];

export default function AboutSection() {
  return (
    <section
      aria-labelledby="about-heading"
      id="about"
      className="min-h-screen bg-white"
    >
      {/* Content Section */}
      <div>
        {/* Header */}
        <header
          id="about-heading"
          className="mx-auto flex flex-col place-items-center gap-4 p-4 text-center"
        >
          <h1 className="bg-gradient-to-r from-[var(--cel-blue)] to-[var(--cel-red)] bg-clip-text text-6xl font-bold uppercase text-transparent">
            We Forge Legends.
          </h1>
          <p className="text-wrap text-neutral-500">
            CESAFI Esports League (CEL) is the biggest student-oriented esports
            league in Cebu City, fostering students' talents in-game.
          </p>
        </header>

        {/* Stat Information */}
        <section aria-labelledby="stats-heading" className="p-8">
          <h2 id="stats-heading" className="sr-only">
            Statistical Highlights
          </h2>
          <ul className="flex flex-wrap justify-evenly">
            {statInformation.map((info, index) => (
              <li
                key={index}
                className="flex h-auto w-40 flex-col gap-1 p-4 text-center"
              >
                <h3 className="text-3xl font-bold text-neutral-800 md:text-5xl">
                  {info.heading}
                </h3>
                <span className="md:text-md text-xs text-neutral-500">
                  {info.desc}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="seasons-heading"
          className="flex flex-col bg-[var(--background)]"
        >
          <h2 id="seasons-heading" className="sr-only">
            About Us
          </h2>

          <p></p>
        </section>

        {/* About Us */}
        <section
          aria-labelledby="about-us-heading"
          className="flex flex-col bg-[var(--background)] py-16"
        >
          <h2 id="about-us-heading" className="sr-only">
            About Us
          </h2>
          {aboutUsData.map((data, index) => (
            <article
              key={index}
              className="mx-auto grid gap-8 py-8 md:w-[80vw] md:grid-cols-2"
            >
              <figure className={`${index % 2 !== 0 ? 'md:order-2' : ''}`}>
                <Image
                  src={data.image}
                  alt={`${data.title} - CESAFI Esports League`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  width={1280}
                  height={1280}
                  quality={100}
                  className="h-auto w-full object-contain md:rounded-lg"
                />
              </figure>
              <div className="col-span-1">
                <div className="flex h-full flex-col justify-center gap-4 bg-neutral-900 p-8 md:rounded-lg">
                  <header>
                    <h3 className="text-xl font-bold uppercase md:text-4xl">
                      {data.title}
                    </h3>
                  </header>
                  <p className="text-justify text-xs font-light md:text-base">
                    {data.paragraph}
                  </p>
                </div>
              </div>
            </article>
          ))}

          {/* Join Us */}
          <Link
            href="/"
            className="relative h-64 bg-[var(--background)] md:h-96"
          >
            <Image
              src={about_4}
              alt="CESAFI Esports League Staff"
              sizes="(max-width: 768px) 100vw, 50vw"
              width={2048}
              height={1365}
              quality={100}
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
            <div className="relative z-10 flex h-full items-center justify-center">
              <p className="text-center text-4xl font-extrabold uppercase">
                Join the CESAFI Esports Team
              </p>
            </div>
          </Link>
        </section>
      </div>
    </section>
  );
}
