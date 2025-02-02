import type { Metadata } from 'next';
import { manrope, delagothic } from '@/lib/fonts';
import { Providers } from '@/app/providers';
import NextTopLoader from 'nextjs-toploader';
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
