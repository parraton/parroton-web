'use client';

import { useChangeLanguage } from './use-change-language';

export function LanguageToggle() {
  const { currentLanguage, changeLanguage } = useChangeLanguage();

  return (
    <input
      className='custom-switch bg-custom-button'
      type='checkbox'
      onChange={() => changeLanguage(currentLanguage === 'en' ? 'ua' : 'en')}
      checked={currentLanguage !== 'ua'}
    />
  );
}
