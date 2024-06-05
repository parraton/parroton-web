import {Tabs, TabsContent, TabsList, TabsTrigger} from '@components/ui/tabs';

import {actions} from '@app/[lng]/[vault]/page.info';
import {DepositForm} from '@components/vault-form/deposit.form';
import {WithdrawForm} from '@components/vault-form/withdraw.form';
import {Language} from '@i18n/settings';
import {serverTranslation} from '@i18n';
import {DepositCard} from '@components/vault-form/deposit.card';
import {WithdrawCard} from '@components/vault-form/withdraw.card';
import {PoolDeposit} from "@components/pool-deposit";

export async function Form({lng}: { lng: Language }) {
  const {t} = await serverTranslation(lng, 'form');

  return (
    <Tabs defaultValue={actions.deposit} className='w-[400px]'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value={actions.deposit}>{t('deposit_title')}</TabsTrigger>
        <TabsTrigger value={actions.withdraw}>{t('withdraw_title')}</TabsTrigger>
      </TabsList>
      <PoolDeposit/>
      <TabsContent value={actions.deposit}>
        <DepositCard lng={lng}>
          <DepositForm/>
        </DepositCard>
      </TabsContent>
      <TabsContent value={actions.withdraw}>
        <WithdrawCard lng={lng}>
          <WithdrawForm/>
        </WithdrawCard>
      </TabsContent>
    </Tabs>
  );
}
