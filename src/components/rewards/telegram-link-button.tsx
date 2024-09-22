import { useInitData, useWebApp } from '@vkruglikov/react-telegram-web-app';
import React, { useCallback } from 'react';

interface TelegramLinkButtonProps {
  link: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const TelegramLinkButton = ({
  link,
  className,
  style,
  children,
}: TelegramLinkButtonProps) => {
  const webApp = useWebApp();
  const [, initData] = useInitData();

  const handleButtonClick = useCallback(() => webApp.openTelegramLink(link), [link, webApp]);

  return initData ? (
    <button className={className} style={style} type='button' onClick={handleButtonClick}>
      {children}
    </button>
  ) : (
    <a className={className} style={style} href={link} target='_blank'>
      {children}
    </a>
  );
};
