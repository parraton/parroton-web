import { usePathname } from 'next/navigation';
import { useParams } from '@routes/hooks';
import { Home } from '@routes';
import { Language, languages } from '@i18n/settings';

export const useChangeLanguage = () => {
  const pathname = usePathname();
  const { lng } = useParams(Home);

  const langs = languages.filter((lang) => lang !== lng);

  const changeLanguage = (lang: string) => {
    window.location.pathname = pathname.replace(`/${lng}`, `/${lang}`);
  };

  return { currentLanguage: lng as Language, languages: langs, changeLanguage };
};
