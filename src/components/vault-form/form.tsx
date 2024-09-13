'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';

import { DepositForm } from '@components/vault-form/deposit.form';
import { WithdrawForm } from '@components/vault-form/withdraw.form';
import { FormCard } from '@components/vault-form/form-card';
import { cn } from '@lib/utils';
import { Actions } from '@types';
import { CardContent, CardFooter } from '@UI/card';
import { ClaimBalance } from '@components/claim/claim-balance';
import { ClaimButton } from '@components/claim/claim.button';
import { FaucetForm } from '@components/vault-form/faucet.form';
import { isMainnet } from '@lib/utils';
import { useMemo } from 'react';
import { Address } from '@ton/core';
import { useTranslation } from '@i18n/client';
import { useVaultData } from '@hooks/use-vault-data';
import { VaultPage } from '@routes';
import { useParams } from '@routes/hooks';

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

export function Form() {
  const { vault: vaultAddress } = useParams(VaultPage);
  const { t } = useTranslation({ ns: 'form' });

  const { vault } = useVaultData(vaultAddress);
  const formattedLpAddress = useMemo(
    () => (vault ? Address.parse(vault.lpMetadata.address).toString() : ''),
    [vault],
  );

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
        <FormCard formattedLpAddress={formattedLpAddress} action={Actions.deposit}>
          <DepositForm />
        </FormCard>
      </TabsContent>
      <TabsContent value={Actions.withdraw}>
        <FormCard formattedLpAddress={formattedLpAddress} action={Actions.withdraw}>
          <WithdrawForm />
        </FormCard>
      </TabsContent>
      <TabsContent value={Actions.faucet}>
        <FormCard formattedLpAddress={formattedLpAddress} action={Actions.faucet}>
          <CardFooter className={'justify-between'}>
            <FaucetForm />
          </CardFooter>
        </FormCard>
      </TabsContent>
      <TabsContent value={Actions.claim}>
        <FormCard formattedLpAddress={formattedLpAddress} action={Actions.claim}>
          <CardContent className='space-y-2'>
            <ClaimBalance />
            <ClaimButton />
          </CardContent>
        </FormCard>
      </TabsContent>
    </Tabs>
  );
}
