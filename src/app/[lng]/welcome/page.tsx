import { serverTranslation } from '@i18n';
import { WelcomeButtons } from '@components/welcome-buttons';
import { RouteHoc } from '@routes/hoc';
import { Route } from './page.info';
import { RouteInfoToLayout } from '@routes/makeRoute';

async function WelcomePage({ params }: RouteInfoToLayout<typeof Route>) {
  const { t } = await serverTranslation(params.lng, 'welcome');

  return (
    <div className='flex flex-col gap-4 p-8 pt-32'>
      <h2 className='text-2xl'>{t('main')}</h2>
      <h3 className='text-sm'>{t('description')}</h3>
      <div
        style={{
          boxShadow: '0 0 8px 8px hsl(var(--background)) inset',
          borderRadius: '1rem',
          width: '100%',
          aspectRatio: 732 / 558,
          backgroundImage: 'url(/welcome.gif)',
          backgroundSize: 'cover',
        }}
      ></div>
      <WelcomeButtons />
    </div>
  );
}

export default RouteHoc(Route)(WelcomePage);
