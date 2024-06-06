import type { Metadata } from 'next';
import { serverTranslation } from '@i18n';
import { RouteInfoToLayout } from '@routes/makeRoute';
import { Route } from './page.info';
import { VaultCard, VaultCardProps } from '@components/vault-card';
import { addresses } from '@config/contracts-config';
import { tonClient } from '@core/config';
import { Vault } from '@core';
import { OpenedContract } from '@ton/core';

// import { getLpBalance } from '@hooks/use-lp-balance';

export async function generateMetadata({
  params,
}: RouteInfoToLayout<typeof Route>): Promise<Metadata> {
  const { t } = await serverTranslation(params.lng!, 'common');

  return {
    title: t('app_title'),
    description: t('app_description'),
  };
}

const vaultsAddresses = Object.values(addresses.vaults).map(({ vault }) => vault);
const vaults = vaultsAddresses.map((vault) => {
  const rawVault = Vault.createFromAddress(vault);
  return tonClient.open(rawVault);
});

const getVaultCardData = async (vault: OpenedContract<Vault>): Promise<VaultCardProps> => {
  // const data = await vault.getVaultData();
  //
  //
  // const balance = await getLpBalance(vault.address.toString());

  return {
    title: 'ETH (ezETH Market)',
    tags: ['ezETH', 'ETH'],
    balance: '13.98',
    currency: 'ETH',
    deposited: '12.02',
    apy: '7.94',
    daily: '0.02',
    tvl: '1298343.32',
    address: vault.address.toString(),
  };
};

export default async function Home({ params }: RouteInfoToLayout<typeof Route>) {
  const vaultsData = await Promise.all(vaults.map(getVaultCardData));

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      {vaultsData.map((data, index) => (
        <VaultCard key={index} data={data} locale={params.lng!} />
      ))}
    </main>
  );
}
