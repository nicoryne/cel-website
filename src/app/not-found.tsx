import Link from 'next/link';

export default function ErrorPage() {
  return (
    <main className="h-screen place-items-center content-center">
      <section className="h-auto place-items-center text-center">
        <h1 className="text-xl font-bold text-[var(--accent-primary)]">404</h1>
        <h2 className="mb-8 text-4xl font-bold uppercase text-[var(--accent-secondary)]">
          Page not found
        </h2>

        <Link
          href="/"
          className="mt-10 text-center text-sm font-semibold leading-6 text-gray-500 hover:text-[var(--accent-secondary)]"
        >
          Go back home
        </Link>
      </section>
    </main>
  );
}
