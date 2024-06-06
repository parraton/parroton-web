import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';

import { DepositForm } from '@components/vault-form/deposit.form';
import { WithdrawForm } from '@components/vault-form/withdraw.form';
import { Language } from '@i18n/settings';
import { serverTranslation } from '@i18n';
import { FormCard } from '@components/vault-form/form-card';
import { FaucetButton } from '@components/faucet/faucet-button';
import { cn } from '@lib/utils';
import { Actions } from '@types';

const keysCount = Object.keys(Actions).length;

export async function Form({ lng }: { lng: Language }) {
  const { t } = await serverTranslation(lng, 'form');

  return (
    <Tabs defaultValue={Actions.deposit} className='w-[400px]'>
      <TabsList className={cn('grid w-full', `grid-cols-${keysCount}`)}>
        <TabsTrigger value={Actions.deposit}>{t('deposit_title')}</TabsTrigger>
        <TabsTrigger value={Actions.withdraw}>{t('withdraw_title')}</TabsTrigger>
        <TabsTrigger value={Actions.faucet}>{t('faucet_title')}</TabsTrigger>
        <TabsTrigger value={Actions.claim}>{t('claim_title')}</TabsTrigger>
      </TabsList>
      <TabsContent value={Actions.deposit}>
        <FormCard action={Actions.deposit} lng={lng}>
          <DepositForm />
        </FormCard>
      </TabsContent>
      <TabsContent value={Actions.withdraw}>
        <FormCard action={Actions.withdraw} lng={lng}>
          <WithdrawForm />
        </FormCard>
      </TabsContent>
      <TabsContent value={Actions.faucet}>
        <FormCard action={Actions.faucet} lng={lng}>
          <FaucetButton />
        </FormCard>
      </TabsContent>
      <TabsContent value={Actions.claim}>
        <FormCard action={Actions.claim} lng={lng}>
          <div>Claim</div>
        </FormCard>
      </TabsContent>
    </Tabs>
  );
}
