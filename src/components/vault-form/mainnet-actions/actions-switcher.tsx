import { useTranslation } from '@i18n/client';
import { MainnetAction } from './types';
import { cn } from '@lib/utils';
import { useCallback } from 'react';

interface ActionsSwitcherProps {
  value: MainnetAction;
  // eslint-disable-next-line no-unused-vars
  onChange: (action: MainnetAction) => void;
}

const actions: MainnetAction[] = ['deposit', 'withdraw'];

export const ActionsSwitcher = ({ value, onChange }: ActionsSwitcherProps) => (
  <div className='grid h-auto w-full grid-cols-2 rounded-full border border-switcher bg-transparent p-0'>
    {actions.map((actionName) => (
      <ActionItem
        key={actionName}
        action={actionName}
        active={value === actionName}
        onClick={onChange}
      />
    ))}
  </div>
);

interface ActionItemProps {
  action: MainnetAction;
  active: boolean;
  // eslint-disable-next-line no-unused-vars
  onClick: (action: MainnetAction) => void;
}

const ActionItem = ({ action, active, onClick }: ActionItemProps) => {
  const { t } = useTranslation({ ns: 'form' });

  const handleClick = useCallback(() => onClick(action), [action, onClick]);

  return (
    <button
      type='button'
      className={cn(
        'rounded-full py-2 text-xs text-white',
        active ? 'bg-switcher font-semibold' : 'bg-transparent',
      )}
      onClick={handleClick}
    >
      {t(`${action}_title`)}
    </button>
  );
};
