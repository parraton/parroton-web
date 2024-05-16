import { usePathname, useRouter } from 'next/navigation';
import { useParams } from '@routes/hooks';
import { Home } from '@routes';
import { Language, languages } from '@i18n/settings';

export const useChangeLanguage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { lng } = useParams(Home);

  const langs = languages.filter((lang) => lang !== lng);

  const changeLanguage = (lang: string) => {
    const newPath = pathname.replace(`/${lng}`, `/${lang}`);

    router.push(newPath, { scroll: false });
  };

  return { currentLanguage: lng as Language, languages: langs, changeLanguage };
};
