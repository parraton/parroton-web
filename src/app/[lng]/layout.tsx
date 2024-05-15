import './globals.css';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Navbar } from '@components/navbar';
import { languages } from '@i18n/settings';
import { dir } from 'i18next';
import { SandwichProvider } from '@components/providers/sandwich';
import { WithLocaleParams } from '@types';

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
}: React.PropsWithChildren<WithLocaleParams>) {
  return (
    <html lang={lng} dir={dir(lng)}>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <SandwichProvider>
          <div>
            <Navbar lng={lng} />
            {children}
          </div>
        </SandwichProvider>
      </body>
    </html>
  );
}
