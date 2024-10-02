import { SettingsIcon } from '@components/icons/settings';
import { cn } from '@lib/utils';
import React from 'react';

interface SettingsButtonProps {
  className?: string;
  isActive: boolean;
  onClick: () => void;
}

export const SettingsButton = ({ className, isActive, onClick }: SettingsButtonProps) => (
  <button
    type='button'
    className={cn(className, !isActive && 'hover:text-custom-link')}
    onClick={onClick}
  >
    <SettingsIcon
      className={cn('size-9 fill-current md:hidden', isActive && 'text-custom-button')}
    />
    <SettingsIcon className='hidden size-6 fill-current md:block' />
  </button>
);
