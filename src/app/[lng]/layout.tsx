import './globals.css';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Navbar } from '@components/navbar';
import { languages } from '@i18n/settings';
import { dir } from 'i18next';
import { SandwichProvider } from '@components/providers/sandwich';
import { Route } from '@app/[lng]/page.info';
import { RouteInfoToLayout } from '@routes/makeRoute';

import '../../styles/main.scss';

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
}: React.PropsWithChildren<RouteInfoToLayout<typeof Route>>) {
  return (
    <html lang={lng} dir={dir(lng)}>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <SandwichProvider>
          <div className={cn('grid min-h-screen', 'grid-rows-[auto,1fr]')}>
            <Navbar lng={lng!} />
            {/* <main className='grid min-h-screen gap-4 p-24 pt-14'>{children}</main> */}
            <main className='custom-main-container bg-background'>{children}</main>
          </div>
        </SandwichProvider>
      </body>
    </html>
  );
}
