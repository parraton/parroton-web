'use client';

import * as React from 'react';
import { Suspense, useEffect } from 'react';
import { ThemeProvider } from './theme-provider';
import { Toaster } from '@UI/sonner';
import { Locales, THEME, TonConnectUIProvider, useTonConnectUI } from '@tonconnect/ui-react';
import { useParams, useSearchParams } from '@routes/hooks';
import { Home } from '@routes';
import { useCloudStorage, useInitData, WebAppProvider } from '@vkruglikov/react-telegram-web-app';
import { Guard } from '@components/guard';
// import { TxNotification } from '@components/tx-notification';

const themeMap = {
  light: THEME.LIGHT,
  dark: THEME.DARK,
  system: undefined,
};

const SetTonConnectSettings = () => {
  const [, setOptions] = useTonConnectUI();

  const params = useParams(Home);
  useEffect(() => {
    setOptions({
      language: params.lng! as Locales,
      uiPreferences: {
        // TODO: Use the theme from useTheme when light theme is implemented
        theme: themeMap.dark,
      },
    });
  }, [setOptions, params.lng]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('eruda').then((lib) => lib.default.init()).catch(console.error);
    }
  }, []);

  return <></>;
};

const SetReferral = () => {
  const { ref } = useSearchParams(Home);
  const [unsafe] = useInitData();
  const { setItem, getItem } = useCloudStorage();

  useEffect(() => {
    const existingRef = localStorage.getItem('ref');
    if (ref && ref !== existingRef) {
      localStorage.setItem('ref', ref);
    }
  }, [ref]);

  useEffect(() => {
    if (unsafe?.start_param) {
      (async () => {
        const { start_param } = unsafe;

        const existingRef = await getItem('ref');
        if (start_param && start_param !== existingRef) {
          await setItem('ref', start_param);
        }
      })();
    }
  }, [getItem, setItem, unsafe, unsafe?.start_param]);

  return <></>;
};

export function SandwichProvider({ children }: React.PropsWithChildren) {
  const manifestUrl = `${typeof window === 'undefined' ? 'https:' : window.location.protocol}//\
${typeof window === 'undefined' ? 'parraton.com' : window.location.hostname}/tonconnect-manifest.json`;

  return (
    <WebAppProvider
      options={{
        smoothButtonsTransition: true,
      }}
    >
      <Guard />
      <Suspense>
        <SetReferral />
      </Suspense>
      {/* TODO: replace with the element below when the light theme is ready */}
      <ThemeProvider attribute='class' forcedTheme='dark' disableTransitionOnChange>
        {/* <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange> */}
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
