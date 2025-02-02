import Image from 'next/image';
import cel_logo from '@/../public/logos/cel.webp';

import MotionComponent from '@/components/ui/motion-component';

export default function HeroSection() {
  const headerTitle = 'CESAFI ESPORTS LEAGUE';
  const headerDesc = 'The den of the best esports student athletes';

  return (
    <section
      aria-labelledby="hero-heading"
      id="home"
      className="relative min-h-[750px] w-full overflow-hidden bg-hero-gradient"
    >
      <div aria-hidden="true">
        <video
          id="hero-video"
          autoPlay
          loop
          muted
          playsInline
          className="absolute left-0 top-0 h-[750px] w-full object-cover opacity-30"
        >
          <source src="/videos/hero_video.mp4" type="video/mp4" />
          <source src="/videos/hero_video.webm" type="video/webm" />
        </video>
      </div>

      <div
        className="absolute inset-0 m-auto flex h-fit flex-col items-center justify-between px-4 text-white md:w-[700px] md:flex-row lg:w-[900px]"
        role="banner"
      >
        <header className="mb-12 flex w-[70%] max-w-full flex-col gap-4 text-center md:mb-0 md:text-left">
          <h1 id="hero-heading" className="text-4xl text-white md:text-6xl">
            {headerTitle}
          </h1>
          <p className="text-white">{headerDesc}</p>
        </header>

        <MotionComponent
          type="div"
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
          whileTap={{ scale: 1.08 }}
          aria-label="CESAFI Esports League Logo"
        >
          <Image
            className="h-auto w-56 object-contain md:w-80"
            src={cel_logo}
            alt="CESAFI Esports League Logo"
            width={300}
            height={300}
            priority
          />
        </MotionComponent>
      </div>

      <footer className="absolute bottom-0 w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 24 150 28"
          height={80}
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full"
        >
          <defs>
            <path
              id="wave-path"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            ></path>
          </defs>

          {/* Wave 1 */}
          <MotionComponent
            type="g"
            initial={{ x: 0 }}
            animate={{ x: [0, -40, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <use xlinkHref="#wave-path" x="50" y="3" fill="rgba(255, 255, 255, 0.1)"></use>
          </MotionComponent>

          {/* Wave 2 */}
          <MotionComponent
            type="g"
            initial={{ x: 0 }}
            animate={{ x: [0, -60, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <use xlinkHref="#wave-path" x="50" y="0" fill="rgba(255, 255, 255, 0.2)"></use>
          </MotionComponent>

          {/* Wave 3 */}
          <MotionComponent
            type="g"
            initial={{ x: 0 }}
            animate={{ x: [0, -80, 0] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <use xlinkHref="#wave-path" x="50" y="7" fill="#ffff"></use>
          </MotionComponent>
        </svg>
      </footer>
    </section>
  );
}
