import Image from 'next/image';
import cel_logo from '@/../public/logos/cel.webp';

export default function MaintenancePage() {
  return (
    <>
      <main className="h-screen w-screen">
        <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-16">
          <div>
            <Image src={cel_logo} alt="CEL Logo" className="h-auto w-80" />
          </div>
          <div className="flex flex-col gap-4 text-center">
            <h1 className="text-4xl font-bold uppercase text-[var(--cel-red)]">
              Site is Under Maintenance
            </h1>
            <p className="text-xl">Please stay tuned for more updates!</p>
          </div>
        </div>
      </main>
    </>
  );
}
