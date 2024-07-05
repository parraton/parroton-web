import './globals.css';
import React, { PropsWithChildren } from 'react';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Navbar } from '@components/navbar';
import { languages } from '@i18n/settings';
import { dir } from 'i18next';
import { SandwichProvider } from '@components/providers/sandwich';
import { Route } from '@app/[lng]/page.info';
import { RouteInfoToLayout } from '@routes/makeRoute';

import '../../styles/main.scss';
import { LayoutProvider } from '@components/providers/layout-provider';
import Script from 'next/script';

const fontSans = FontSans({
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
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <SandwichProvider>
          <div className={cn('grid min-h-screen', 'grid-rows-[auto,1fr]')}>
            <LayoutProvider
              injectedChildren={children}
              layout={(props) => (
                <>
                  <Navbar lng={lng!} />
                  <main className='custom-main-container bg-background'>
                    {props.children}
                    <div className='cloud-container'>
                      <div className='cloud' />
                      <div className='cloud' />
                      <div className='cloud' />
                      <div className='island' />
                    </div>
                  </main>
                </>
              )}
            />
          </div>
        </SandwichProvider>
        <Script src='https://telegram.org/js/telegram-web-app.js' strategy='beforeInteractive' />
      </body>
    </html>
  );
}
