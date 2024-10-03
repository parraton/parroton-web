import { SettingsIcon } from '@components/icons/settings';
import React from 'react';
import { LinkButton } from './link-button';

interface SettingsButtonProps {
  className?: string;
  isActive: boolean;
}

export const SettingsButton = ({ className, isActive }: SettingsButtonProps) => (
  <LinkButton
    className={className}
    href='/settings'
    isActive={isActive}
    Icon={SettingsIcon}
    desktopIconClassName='!size-6'
  />
);
