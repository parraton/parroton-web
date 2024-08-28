'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { ThemeProvider } from './theme-provider';
import { Toaster } from '@UI/sonner';
import { Locales, THEME, TonConnectUIProvider, useTonConnectUI } from '@tonconnect/ui-react';
import { useParams, useSearchParams } from '@routes/hooks';
import { Home } from '@routes';
import { useTheme } from 'next-themes';
import { WebAppProvider } from '@vkruglikov/react-telegram-web-app';
import { domain } from '@config/links';
// import { TxNotification } from '@components/tx-notification';

const themeMap = {
  light: THEME.LIGHT,
  dark: THEME.DARK,
  system: undefined,
};

const SetTonConnectSettings = () => {
  const [, setOptions] = useTonConnectUI();

  const params = useParams(Home);
  const { theme } = useTheme();
  useEffect(() => {
    setOptions({
      language: params.lng! as Locales,
      uiPreferences: {
        theme: themeMap[theme as keyof typeof themeMap],
      },
    });
  }, [setOptions, theme, params.lng]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('eruda').then((lib) => lib.default.init());
    }
  }, []);

  return <></>;
};

const SetReferral = () => {
  const { ref } = useSearchParams(Home);
  useEffect(() => {
    const existingRef = localStorage.getItem('ref');
    if (ref && ref !== existingRef) {
      localStorage.setItem('ref', ref);
    }
  }, [ref]);

  return <></>;
};

//import tonconnect manifest as url
const manifestUrl = `${domain}/tonconnect-manifest.json`;

export function SandwichProvider({ children }: React.PropsWithChildren) {
  return (
    <WebAppProvider
      options={{
        smoothButtonsTransition: true,
      }}
    >
      <SetReferral />
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        {/*<TxNotification />*/}
        <TonConnectUIProvider manifestUrl={manifestUrl}>
          <SetTonConnectSettings />
          {children}
        </TonConnectUIProvider>
        <Toaster />
      </ThemeProvider>
    </WebAppProvider>
  );
}
