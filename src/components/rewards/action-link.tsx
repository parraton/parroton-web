import { useInitData, useWebApp } from '@vkruglikov/react-telegram-web-app';
import React, { useCallback } from 'react';

interface ActionLinkProps {
  link: string;
  isTelegram: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  // eslint-disable-next-line no-unused-vars
  onClick: (link: string) => void;
}

export const ActionLink = ({
  link,
  className,
  style,
  children,
  isTelegram,
  onClick,
}: ActionLinkProps) => {
  const webApp = useWebApp();
  const [, initData] = useInitData();
  const isTelegramButton = initData && isTelegram;

  const handleClick = useCallback(() => {
    if (isTelegramButton) {
      webApp.openTelegramLink(link);
    }
    onClick(link);
  }, [isTelegramButton, link, onClick, webApp]);

  return isTelegramButton ? (
    <button className={className} style={style} type='button' onClick={handleClick}>
      {children}
    </button>
  ) : (
    <a className={className} style={style} href={link} target='_blank' onClick={handleClick}>
      {children}
    </a>
  );
};
