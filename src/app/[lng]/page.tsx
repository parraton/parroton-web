import type { Metadata } from 'next';
import type { WithLocaleParams } from '@types';
import { Demo } from '@components/Demo';
import { serverTranslation } from '@i18n';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: WithLocaleParams<Props>): Promise<Metadata> {
  const { lng } = params;

  const { t } = await serverTranslation(lng, 'common');

  return {
    title: t('app_title'),
    description: t('app_description'),
  };
}

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <Demo />
    </main>
  );
}
