'use client';
import about_1 from '@/../../public/images/about_1.webp';
import about_2 from '@/../../public/images/about_2.webp';
import about_3 from '@/../../public/images/about_3.webp';
import about_4 from '@/../../public/images/about_4.webp';
import Image from 'next/image';
import { motion } from 'framer-motion';

const statInformation = [
  { heading: '10', desc: 'Participating Schools' },
  { heading: '100+', desc: 'Student Volunteers' },
  { heading: '120+', desc: 'Student Athletes' },
  { heading: '25K+', desc: ' Followers' },
  { heading: '2M+', desc: 'Reach' }
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
        <div>
          <ul className="flex flex-wrap justify-evenly p-8">
            {statInformation.map((info, index) => (
              <li
                key={index}
                className="flex h-auto w-40 flex-col gap-1 p-4 text-center"
              >
                <h3 className="text-3xl font-bold text-neutral-800 md:text-5xl">
                  {info.heading}
                </h3>
                <span className="md:text-md text-xs text-neutral-400">
                  {info.desc}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pictures */}
        <div className="flex flex-col">
          {/* About 1 */}
          <div className="grid md:grid-cols-2">
            <div className="relative">
              <Image
                src={about_1}
                alt="CEL Preseason 3 Finale Audience"
                className="object-contain"
              />
            </div>
            <div className="flex flex-col justify-center gap-4 bg-[var(--background)] p-16">
              <h1 className="text-xl font-bold uppercase md:text-4xl">
                Humble Beginnings
              </h1>
              <p className="text-xs font-light md:text-base">
                Etiam aliquam risus non ultricies posuere. Ut eu turpis nec
                massa viverra posuere ut vel felis. Donec tincidunt metus nec
                tempus accumsan. Ut ultrices consequat aliquet. Nunc rhoncus,
                urna quis luctus condimentum, risus lectus fringilla justo, sit
                amet iaculis ante sapien vitae leo. Mauris scelerisque feugiat
                neque, quis hendrerit libero efficitur vitae. Aliquam erat
                volutpat. Pellentesque in magna lorem. Nulla euismod nulla id
                maximus efficitur. Suspendisse vel bibendum neque, a malesuada
                velit. Integer tempor lectus et massa volutpat, in aliquet neque
                euismod. Vestibulum mollis lacus vel ipsum viverra, eu tristique
                sem sollicitudin. Nunc congue congue velit, a dignissim leo
                consequat in. In mollis tortor commodo lectus fermentum
                faucibus.
              </p>
            </div>
          </div>

          {/* About 2 */}
          <div className="grid md:grid-cols-2">
            <div className="relative md:order-2">
              <Image
                src={about_2}
                alt="CEL Preseason 3 Finale Production"
                className="object-contain"
              />
            </div>
            <div className="col-span-1 flex flex-col justify-center gap-4 bg-[var(--background)] p-16">
              <h1 className="text-xl font-bold uppercase md:text-4xl">
                Into the Forge
              </h1>
              <p className="text-xs font-light md:text-base">
                Etiam aliquam risus non ultricies posuere. Ut eu turpis nec
                massa viverra posuere ut vel felis. Donec tincidunt metus nec
                tempus accumsan. Ut ultrices consequat aliquet. Nunc rhoncus,
                urna quis luctus condimentum, risus lectus fringilla justo, sit
                amet iaculis ante sapien vitae leo. Mauris scelerisque feugiat
                neque, quis hendrerit libero efficitur vitae. Aliquam erat
                volutpat. Pellentesque in magna lorem. Nulla euismod nulla id
                maximus efficitur. Suspendisse vel bibendum neque, a malesuada
                velit. Integer tempor lectus et massa volutpat, in aliquet neque
                euismod. Vestibulum mollis lacus vel ipsum viverra, eu tristique
                sem sollicitudin. Nunc congue congue velit, a dignissim leo
                consequat in. In mollis tortor commodo lectus fermentum
                faucibus.
              </p>
            </div>
          </div>

          {/* About 3 */}
          <div className="grid md:grid-cols-2">
            <div className="relative">
              <Image
                src={about_3}
                alt="CEL Preseason 3 Finale Trophies"
                className="object-contain"
              />
            </div>
            <div className="col-span-1 flex flex-col justify-center gap-4 bg-[var(--background)] p-16">
              <h1 className="text-xl font-bold uppercase md:text-4xl">
                Burning with Passion
              </h1>
              <p className="text-xs font-light md:text-base">
                Etiam aliquam risus non ultricies posuere. Ut eu turpis nec
                massa viverra posuere ut vel felis. Donec tincidunt metus nec
                tempus accumsan. Ut ultrices consequat aliquet. Nunc rhoncus,
                urna quis luctus condimentum, risus lectus fringilla justo, sit
                amet iaculis ante sapien vitae leo. Mauris scelerisque feugiat
                neque, quis hendrerit libero efficitur vitae. Aliquam erat
                volutpat. Pellentesque in magna lorem. Nulla euismod nulla id
                maximus efficitur. Suspendisse vel bibendum neque, a malesuada
                velit. Integer tempor lectus et massa volutpat, in aliquet neque
                euismod. Vestibulum mollis lacus vel ipsum viverra, eu tristique
                sem sollicitudin. Nunc congue congue velit, a dignissim leo
                consequat in. In mollis tortor commodo lectus fermentum
                faucibus.
              </p>
            </div>
          </div>

          {/* Join Us */}
          <div className="relative h-64 bg-[var(--background)] md:h-96">
            {/* Background Image */}
            <Image
              src={about_4}
              alt="CEL Preseason 3 Finale Trophies"
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />

            {/* Content Overlay */}
            <div className="relative z-10 flex h-full items-center justify-center">
              <motion.button
                className="text-4xl font-extrabold uppercase"
                whileHover={{ scale: 1.04 }}
              >
                Join The Team
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
