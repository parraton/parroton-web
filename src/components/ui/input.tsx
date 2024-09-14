import * as React from 'react';

import { cn } from '@lib/utils';
import { useTranslation } from '@i18n/client';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onMaxAmountClick?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onMaxAmountClick, ...props }, ref) => {
    const { t } = useTranslation({ ns: 'form' });

    return (
      <div className='relative w-full'>
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm opacity-50 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-20',
            className,
          )}
          ref={ref}
          {...props}
        />
        {onMaxAmountClick && (
          <button
            className={cn(
              'absolute bottom-px right-px top-px flex items-center justify-center',
              'rounded-r-umd px-2 text-sm font-medium text-[#19a7e7] hover:bg-background hover:bg-opacity-50',
            )}
            onClick={onMaxAmountClick}
            type='button'
          >
            {t('max_label')}
          </button>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
