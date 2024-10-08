import { useInitData, useWebApp } from '@vkruglikov/react-telegram-web-app';
import { LoaderCircleIcon } from 'lucide-react';
import React, { useCallback } from 'react';

interface ActionLinkProps {
  link: string;
  questId: string;
  isTelegram: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  loading: boolean;
  // eslint-disable-next-line no-unused-vars
  onClick: (link: string, questId: string) => void;
}

export const ActionLink = ({
  link,
  questId,
  className,
  style,
  children,
  isTelegram,
  loading,
  onClick,
}: ActionLinkProps) => {
  const webApp = useWebApp();
  const [, initData] = useInitData();
  const isTelegramButton = initData && isTelegram;

  const handleClick = useCallback(() => {
    if (isTelegramButton) {
      webApp.openTelegramLink(link);
    }
    onClick(link, questId);
  }, [isTelegramButton, link, onClick, questId, webApp]);

  if (loading) {
    return <LoaderCircleIcon size={16} className='animate-spin' />;
  }

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
