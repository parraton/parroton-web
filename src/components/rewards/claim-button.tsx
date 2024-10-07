import { useTranslation } from '@i18n/client';
import React, { useCallback } from 'react';
import { ActionButton } from './action-button';

interface ClaimButtonProps {
  questId: string;
  // eslint-disable-next-line no-unused-vars
  onClick: (taskId: string) => void;
}

export const ClaimButton = ({ questId, onClick }: ClaimButtonProps) => {
  const { t } = useTranslation({ ns: 'rewards' });

  const handleClick = useCallback(() => onClick(questId), [onClick, questId]);

  return <ActionButton onClick={handleClick}>{t('claim')}</ActionButton>;
};
