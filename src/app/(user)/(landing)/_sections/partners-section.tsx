import Image from 'next/image';
import MotionComponent from '@/components/ui/motion-component';
import { getAllPartners } from '@/services/partner';
import Link from 'next/link';

export default async function PartnersSection() {
  const partners = await getAllPartners();

  return (
    <section aria-labelledby="partners-heading" className="bg-white px-8 pb-32 pt-16 dark:bg-white">
      <header className="mx-auto mb-8 w-fit">
        <h4
          id="partners-heading"
          className="border-b bg-red-blue-gradient bg-clip-text py-4 text-center text-xl font-bold text-transparent md:text-3xl"
        >
          Our Partners
        </h4>
      </header>

      <div className="mx-auto flex flex-row flex-wrap place-items-center justify-center gap-16 lg:w-[60vw]">
        {partners &&
          partners.map((partner, index) => (
            <Link key={index} href={`${partner.href}`} target="_blank" rel="noreferrer">
              <MotionComponent
                type="figure"
                className="cursor-grab space-y-2 p-2"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Go to ${partner.name} page`}
              >
                <Image
                  className="h-auto w-24 md:w-32"
                  width={300}
                  height={300}
                  src={partner.logo_url}
                  alt={`${partner.name} Logo`}
                  quality={90}
                  title={`${partner.href}`}
                />
              </MotionComponent>
            </Link>
          ))}
      </div>
    </section>
  );
}
