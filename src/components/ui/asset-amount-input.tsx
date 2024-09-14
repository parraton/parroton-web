import React, { ChangeEvent, forwardRef, useCallback } from 'react';

import { Input, InputProps } from "./input";

export interface AssetAmountInputProps extends Omit<InputProps, 'type' | 'value'> {
  value: string;
}

export const AssetAmountInput = forwardRef<HTMLInputElement, AssetAmountInputProps>(({ onChange, value, ...props }, ref) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(/[^0-9.,]/)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    onChange?.(e);
  }, [onChange]);

  return (
    <Input onChange={handleChange} type="text" value={value} ref={ref} {...props} />
  );
});
