export default function StatisticsLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <aside></aside>
      {children}
    </div>
  );
}
