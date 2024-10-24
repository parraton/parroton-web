import './globals.css';
import React, { PropsWithChildren } from 'react';
import { Work_Sans as FontWorkSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Navbar } from '@components/navbar';
import { languages } from '@i18n/settings';
import { dir } from 'i18next';
import { SandwichProvider } from '@components/providers/sandwich';
import { Route } from '@app/[lng]/page.info';
import { RouteInfoToLayout } from '@routes/makeRoute';

import '../../styles/main.scss';
import Script from 'next/script';

const fontSans = FontWorkSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default function RootLayout({
  children,
  params: { lng },
}: PropsWithChildren<RouteInfoToLayout<typeof Route>>) {
  return (
    <html lang={lng} dir={dir(lng)}>
      <body className={cn('bg-background font-sans antialiased', fontSans.variable)}>
        <SandwichProvider>
          <Navbar lng={lng!} />
          <main className='custom-main-container overflow-auto bg-background'>
            <div className='flex w-full flex-col gap-5 p-5 md:mx-auto md:max-w-md md:px-0'>
              {children}
            </div>
          </main>
        </SandwichProvider>
        <Script src='https://telegram.org/js/telegram-web-app.js' strategy='beforeInteractive' />
      </body>
    </html>
  );
}
