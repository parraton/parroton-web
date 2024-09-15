import React, { ChangeEvent, useCallback } from 'react';

import { Input, InputProps } from './input';

interface AssetAmountInputProps extends Omit<InputProps, 'type' | 'value'> {
  value: string;
}

export const AssetAmountInput = React.forwardRef<HTMLInputElement, AssetAmountInputProps>(
  ({ onChange, value, ...props }, ref) => {
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (/[^\d,.]/.test(e.target.value)) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        onChange?.(e);
      },
      [onChange],
    );

    return <Input onChange={handleChange} type='text' value={value} ref={ref} {...props} />;
  },
);

AssetAmountInput.displayName = 'AssetAmountInput';
