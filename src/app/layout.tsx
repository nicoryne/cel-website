import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { rem } from '@/styles/fonts';
import '@/styles/main.css';

const title = 'CESAFI Esports League | We forge legends!';
const description = 'The den of the best esports student athletes in Cebu';

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
    </html>
  );
}
