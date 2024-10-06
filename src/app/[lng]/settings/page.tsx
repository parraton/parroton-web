import { RouteHoc } from '@routes/hoc';
import { Route } from './page.info';
import { RouteInfoToLayout } from '@routes/makeRoute';
import { serverTranslation } from '@i18n';
import { LanguageToggle } from '@components/toggle-language';
import { ModeToggle } from '@components/mode-toggle';
import { domain, miniAppLink } from '@config/links';
import Resources from '../../../../@types/resources';

interface LinkInput {
  i18nKey?: keyof Resources['settings'];
  label?: string;
  href: string;
}

const links: LinkInput[] = [
  { i18nKey: 'website', href: domain },
  { i18nKey: 'telegram_mini_app', href: miniAppLink },
  { label: 'Github', href: 'https://github.com/parraton' },
  { i18nKey: 'telegram_channel', href: 'https://t.me/parraton_en' },
  { i18nKey: 'docs', href: 'https://docs.parraton.com' },
];

async function SettingsPage({ params }: RouteInfoToLayout<typeof Route>) {
  const { t } = await serverTranslation(params.lng!, 'settings');

  return (
    <div className='flex w-full flex-col gap-3 font-semibold'>
      <h1 className='text-center text-2xl font-bold'>{t('settings_title')}</h1>
      <div className='flex items-center justify-between'>
        <span>{t('language_title')}</span>
        <LanguageToggle />
      </div>
      <div className='flex items-center justify-between'>
        <span>{t('theme_title')}</span>
        <ModeToggle />
      </div>
      <h1 className='text-center text-lg font-bold'>{t('links')}</h1>
      {links.map(({ i18nKey, label, href }) => (
        <a key={href} href={href} target='_blank' className='text-custom-link'>
          {i18nKey ? t(i18nKey) : label}
        </a>
      ))}
    </div>
  );
}

export default RouteHoc(Route)(SettingsPage);
