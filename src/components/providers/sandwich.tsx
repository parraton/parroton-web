'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { ThemeProvider } from './theme-provider';
import { Toaster } from '@UI/sonner';
import { Locales, THEME, TonConnectUIProvider, useTonConnectUI } from '@tonconnect/ui-react';
import { useParams } from '@routes/hooks';
import { Home } from '@routes';
import { useTheme } from 'next-themes';
import { WebAppProvider } from '@vkruglikov/react-telegram-web-app';

const themeMap = {
  light: THEME.LIGHT,
  dark: THEME.DARK,
  system: undefined,
};

const SetTonConnectLanguage = () => {
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

//import tonconnect manifest as url
const manifestUrl = `https://parroton.org/tonconnect-manifest.json`;

export function SandwichProvider({ children }: React.PropsWithChildren) {
  return (
    <WebAppProvider
      options={{
        smoothButtonsTransition: true,
      }}
    >
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        <TonConnectUIProvider manifestUrl={manifestUrl}>
          <SetTonConnectLanguage />
          {children}
        </TonConnectUIProvider>
        <Toaster />
      </ThemeProvider>
    </WebAppProvider>
  );
}
