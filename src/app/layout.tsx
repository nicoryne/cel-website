import type { Metadata } from 'next';
import { manrope, delagothic } from '@/lib/fonts';
import { Providers } from '@/app/providers';
import NextTopLoader from 'nextjs-toploader';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'CESAFI Esports League | We forge legends!',
  description:
    'Stay updated with the latest schedule, standings, and stats of the CESAFI Esports League!',
  icons: {
    icon: [
      {
        url: 'favicon.ico',
        href: 'favicon.ico'
      }
    ]
  },
  openGraph: {
    title: 'CESAFI Esports League',
    description:
      'Stay updated with the latest schedule, standings, and stats of the CESAFI Esports League!',
    url: 'https://cesafiesportsleague.com',
    siteName: 'CESAFI Esports League',
    images: [
      {
        url: 'https://cesafiesportsleague.com/banner.jpg',
        width: 1200,
        height: 630,
        alt: 'CESAFI Esports League Banner'
      }
    ],
    type: 'website'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${delagothic.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-background font-manrope text-foreground">
        <Providers>
          <NextTopLoader color="#0f5390" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
