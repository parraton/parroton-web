import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';

import { DepositForm } from '@components/vault-form/deposit.form';
import { WithdrawForm } from '@components/vault-form/withdraw.form';
import { Language } from '@i18n/settings';
import { serverTranslation } from '@i18n';
import { FormCard } from '@components/vault-form/form-card';
import { cn } from '@lib/utils';
import { Actions } from '@types';
import { CardContent, CardFooter } from '@UI/card';
import { ClaimBalance } from '@components/claim/claim-balance';
import { ClaimButton } from '@components/claim/claim.button';
import { FaucetForm } from '@components/vault-form/faucet.form';
import { isMainnet } from '@lib/utils';

type TabsListItem<Action extends Actions = Actions> = {
  [key in Actions]: {
    title: `${key}_title`;
    action: key;
    hideForMainnet?: boolean;
  };
}[Action];

const tabs: ReadonlyArray<TabsListItem> = [
  {
    title: 'deposit_title',
    action: Actions.deposit,
  },
  {
    title: 'withdraw_title',
    action: Actions.withdraw,
  },
  {
    title: 'faucet_title',
    action: Actions.faucet,
    hideForMainnet: true,
  },
  {
    title: 'claim_title',
    action: Actions.claim,
    hideForMainnet: true,
  },
] as const;

const tabsToRender = tabs.filter((tab) => {
  if (tab.hideForMainnet) {
    return !isMainnet;
  }
  return true;
});

export async function Form({ lng }: { lng: Language }) {
  const { t } = await serverTranslation(lng, 'form');

  return (
    <Tabs defaultValue={Actions.deposit} className='custom-wrapper w-full'>
      <TabsList
        style={{
          gridTemplateColumns: `repeat(${tabsToRender.length}, minmax(0, 1fr))`,
        }}
        className={cn(
          'dark:border-[rgba(255, 255, 255, 0.12)] grid h-auto w-full rounded-[8px] border-[1px] p-0 dark:bg-[#151618]',
        )}
      >
        {tabsToRender.map((tab) => (
          <TabsTrigger
            className='m-px rounded-[7px] dark:data-[state="active"]:!bg-[#FFFFFF1A] dark:data-[state="active"]:!text-[#FFFFFF]'
            key={tab.action}
            value={tab.action}
          >
            {t(tab.title)}
          </TabsTrigger>
        ))}
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
          <CardFooter className={'justify-between'}>
            <FaucetForm />
          </CardFooter>
        </FormCard>
      </TabsContent>
      <TabsContent value={Actions.claim}>
        <FormCard action={Actions.claim} lng={lng}>
          <CardContent className='space-y-2'>
            <ClaimBalance />
            <ClaimButton />
          </CardContent>
        </FormCard>
      </TabsContent>
    </Tabs>
  );
}
