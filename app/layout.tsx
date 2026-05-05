'use client';

import './globals.css';
import { League_Spartan, Montserrat } from 'next/font/google';

const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  variable: '--font-spartan',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${leagueSpartan.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
