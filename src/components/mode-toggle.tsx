'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  console.log({ theme });

  return (
    <input
      className='custom-theme-btn'
      type='checkbox'
      onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      checked={theme !== 'dark'}
    />
  );
}
