interface StandingsPageProps {
  league_stage: Promise<{ league_stage: string }>;
}

export default function StandingsPage({ league_stage }: StandingsPageProps) {
  return (
    <main className="border-r-2 border-neutral-200 bg-background shadow-md dark:border-neutral-700">
      <p></p>
    </main>
  );
}
