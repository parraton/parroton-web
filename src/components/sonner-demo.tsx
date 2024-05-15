'use client';

import { Button } from '@UI/button';
import { toast } from 'sonner';
import { useTranslation } from '@i18n/client';

export function SonnerDemo() {
  const { t } = useTranslation({ ns: 'demo' });

  return (
    <Button
      onClick={() =>
        toast(t('sonner_massage', { message: 'message' }), {
          description: t('sonner_description', { date: new Date().toDateString() }),
          action: {
            label: t('sonner_undo'),
            onClick: () => console.log('Undo'),
          },
        })
      }
    >
      {t('sonner_button_text')}
    </Button>
  );
}
