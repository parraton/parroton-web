import { IconComponentProps } from '@components/icons/types';
import { cn } from '@lib/utils';
import Link from 'next/link';
import React, { FC } from 'react';

interface LinkButtonProps {
  href: string;
  isActive: boolean;
  Icon: FC<IconComponentProps>;
  children?: React.ReactNode;
}

export const LinkButton: FC<LinkButtonProps> = ({ href, Icon, children, isActive }) => (
  <Link href={href}>
    <Icon className={cn('size-9 fill-current md:hidden', isActive && 'text-custom-button')} />
    <Icon className='hidden size-5 fill-current md:block' />
    <span className='custom-nav-text'>{children}</span>
  </Link>
);
