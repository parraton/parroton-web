import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

interface ActionLinkProps {
  href: string;
  children: React.ReactNode;
}

const className = 'rounded-full bg-custom-link p-2 text-xs text-white';

export const ActionLink = ({ href, children }: ActionLinkProps) => {
  const webApp = useWebApp();
  const { push } = useRouter();
  const parsedUrl = useMemo(() => {
    try {
      return new URL(href);
    } catch {
      return null;
    }
  }, [href]);

  const handleClick = useCallback(() => {
    if (parsedUrl?.hostname === 't.me') {
      webApp.openTelegramLink(href);
    } else if (!parsedUrl && href !== '#') {
      push(href);
    }
  }, [href, parsedUrl, push, webApp]);

  if (parsedUrl?.hostname !== 't.me') {
    return (
      <a href={href} target='_blank' className={className}>
        {children}
      </a>
    );
  }

  return (
    <button role='link' onClick={handleClick} className={className}>
      {children}
    </button>
  );
};
