import Link from 'next/link';

export default function MaintenancePage() {
  return (
    <>
      <main className="h-screen place-items-center content-center">
        <section className="h-auto place-items-center text-center">
          <h1 className="text-4xl font-bold uppercase text-[var(--cel-red)]">
            Under Maintenace
          </h1>
          <p className="mb-8 text-xl text-white">
            Please come back another time!
          </p>
          <Link
            href="/"
            className="mt-10 text-center text-sm font-semibold leading-6 text-gray-500 hover:text-[var(--cel-blue)]"
          >
            Go back home
          </Link>
        </section>
      </main>
    </>
  );
}
