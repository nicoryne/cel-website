import about_4 from '@/../../public/images/about_4.webp';
import Image from 'next/image';
import Link from 'next/link';
import { StatInformation, AboutUsData } from '@/app/(user)/(landing)/_sections/data';
import MotionComponent from '@/components/ui/motion-component';

export default function AboutSection() {
  const headerTitle = 'We Forge Legends.';
  const headerDesc = `CESAFI Esports League (CEL) is the biggest student-oriented esports league in Cebu City, fostering students'
            talents in-game.`;

  return (
    <section aria-labelledby="about-heading" id="about" className="min-h-screen">
      {/* Stat Information */}
      <div className="bg-white p-8">
        <header
          id="about-heading"
          className="mx-auto flex w-[90%] flex-col items-center gap-4 p-4 text-center sm:w-[70%] md:w-[60%]"
        >
          <h2 className="bg-blue-red-gradient bg-clip-text text-5xl uppercase text-transparent md:text-6xl">
            {headerTitle}
          </h2>
          <p className="text-wrap text-base text-neutral-500 md:text-lg">{headerDesc}</p>
        </header>
        <ul className="flex flex-col flex-wrap place-items-center justify-center gap-8 md:flex-row md:gap-12">
          {StatInformation.map((info, index) => (
            <li key={index}>
              <div className="flex h-auto flex-col gap-1 p-4 text-center">
                <h3 className="text-5xl text-neutral-800">{info.heading}</h3>
                <span className="text-sm font-semibold text-neutral-500 md:text-base">{info.desc}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col px-8 py-16">
        {AboutUsData.map((data, index) => (
          <MotionComponent
            type="article"
            className="mx-auto grid py-8 lg:w-[80vw] lg:grid-cols-2 lg:gap-8"
            key={index}
            variants={{
              hidden: { opacity: 0.6, scale: 0.97 },
              visible: { opacity: 1, scale: 1 }
            }}
            initial="hidden"
            transition={{ type: 'spring', duration: 0.6, bounce: 0.2 }}
            whileInView="visible"
            viewport={{ once: true }}
          >
            <figure className={`relative ${index % 2 !== 0 ? 'lg:order-2' : ''}`}>
              <Image
                src={data.image}
                alt={`${data.title} - CESAFI Esports League`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={95}
                className="h-auto w-full rounded-lg object-cover"
              />
              <figcaption className="absolute bottom-4 left-4">
                <span className="text-sm font-semibold uppercase text-white shadow-sm">{data.imageDesc}</span>
              </figcaption>
            </figure>
            <div className="col-span-1 px-8 py-16 shadow-lg md:rounded-lg md:p-8 lg:dark:bg-neutral-900">
              <div className="flex h-full flex-col justify-center gap-3">
                <h3 className="text-2xl uppercase xl:text-4xl">{data.title}</h3>
                <p className="text-sm/8 font-light xl:text-lg/8">{data.paragraph}</p>
              </div>
            </div>
          </MotionComponent>
        ))}

        {/* Join Us */}
        <Link
          href="/"
          className="relative my-16 h-64 rounded-md bg-neutral-900 shadow-lg lg:mx-auto lg:h-96 lg:w-[80vw]"
        >
          <Image
            src={about_4}
            alt="CESAFI Esports League Staff"
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={95}
            className="absolute inset-0 h-full w-full rounded-md object-cover opacity-70"
          />
          <div className="relative z-10 flex h-full items-center justify-center">
            <p className="lg:font-2xl font-xs text-center font-delagothic uppercase text-white xl:text-5xl">
              Join the CESAFI Esports Family
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
