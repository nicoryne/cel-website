import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { rem } from '@/styles/fonts';
import '@/styles/main.css';

const title = 'CEL Tracker | Player Statistics and Match Info';
const description = 'Player statistics webpage for CESAFI Esports League';

export const metadata: Metadata = {
  title: title,
  description: description
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={rem.variable}>
      <body>{children}</body>
      <SpeedInsights />
    </html>
  );
}
