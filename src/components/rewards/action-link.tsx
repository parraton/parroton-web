import { LoaderCircleIcon } from 'lucide-react';
import React, { useCallback } from 'react';

interface ActionLinkProps {
  link: string;
  questId: string;
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
  loading,
  onClick,
}: ActionLinkProps) => {
  const handleClick = useCallback(() => onClick(link, questId), [link, onClick, questId]);

  if (loading) {
    return <LoaderCircleIcon size={16} className='animate-spin' />;
  }

  return (
    <button className={className} style={style} type='button' onClick={handleClick}>
      {children}
    </button>
  );
};
