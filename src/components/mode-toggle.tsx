'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <input
      className='custom-switch'
      type='checkbox'
      onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      checked={theme !== 'dark'}
    />
  );
}
