'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@UI/dropdown-menu';
import { Button } from '@UI/button';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { Language } from '@i18n/settings';
import { useTranslation } from '@i18n/client';
import { useChangeLanguage } from './use-change-language';
import { LanguageIcon } from './language-icon';

const IconsMap: Record<Language, ReturnType<typeof LanguageIcon>> = {
  en: <LanguageIcon code='en' icon={<SunIcon />} />,
  ua: <LanguageIcon code='ua' icon={<MoonIcon />} />,
};

export function LanguageToggle() {
  const { t: langt } = useTranslation({ ns: 'language' });
  const { currentLanguage, languages, changeLanguage } = useChangeLanguage();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon'>
          {IconsMap[currentLanguage]}
          <span className='sr-only'>{langt('sr_only_text')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {languages.map((lang) => (
          <DropdownMenuItem key={lang} onClick={() => changeLanguage(lang)}>
            {langt(lang)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
