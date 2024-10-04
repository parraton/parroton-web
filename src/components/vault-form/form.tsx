'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';

import { Language } from '@i18n/settings';
import { FormCard } from '@components/vault-form/form-card';
import { Actions } from '@types';
import { CardContent, CardFooter } from '@UI/card';
import { ClaimBalance } from '@components/claim/claim-balance';
import { ClaimButton } from '@components/claim/claim.button';
import { FaucetForm } from '@components/vault-form/faucet.form';
import { isMainnet } from '@lib/utils';
import { useTranslation } from '@i18n/client';
import { MainnetActionsForm } from './mainnet-actions/form';

type TabsListItem<Action extends Actions = Actions> = {
  [key in Actions]: {
    title: `${key}_title`;
    action: key;
    hideForMainnet?: boolean;
  };
}[Action];

const tabs: ReadonlyArray<TabsListItem> = [
  {
    title: 'deposit_or_withdraw_title',
    action: Actions.depositOrWithdraw,
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

export function Form({ lng, vaultAddress }: { lng: Language; vaultAddress: string }) {
  const { t } = useTranslation({ lng, ns: 'form' });

  if (isMainnet) {
    return <MainnetActionsForm vaultAddress={vaultAddress} />;
  }

  return (
    <Tabs defaultValue={Actions.depositOrWithdraw} className='w-full'>
      <TabsList
        style={{
          gridTemplateColumns: `repeat(${tabsToRender.length}, minmax(0, 1fr))`,
        }}
        className='grid h-auto w-full rounded-full border border-switcher bg-transparent p-0'
      >
        {tabsToRender.map((tab) => (
          <TabsTrigger
            className='rounded-full py-2 text-xs text-white data-[state="active"]:bg-switcher data-[state="active"]:font-semibold'
            key={tab.action}
            value={tab.action}
          >
            {t(tab.title)}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={Actions.depositOrWithdraw}>
        <MainnetActionsForm vaultAddress={vaultAddress} />
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
