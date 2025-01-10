import type { Metadata } from 'next';
import { rem } from '@/lib/fonts';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'CESAFI Esports League | We forge legends!',
  description: 'The den of the best esports student athletes in Cebu',
  icons: {
    icon: [
      {
        url: 'favicon.ico',
        href: 'favicon.ico'
      }
    ]
  }
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
