'use client';

import { useTranslation } from '@i18n/client';
import { useChangeLanguage } from './use-change-language';

export function LanguageToggle() {
  const { t: langt } = useTranslation({ ns: 'language' });
  const { currentLanguage, languages, changeLanguage } = useChangeLanguage();

  return (
    <input
      className='custom-lang-btn'
      type='checkbox'
      onChange={() => changeLanguage(currentLanguage === 'en' ? 'ua' : 'en')}
      checked={currentLanguage !== 'ua'}
    />
  );
}
