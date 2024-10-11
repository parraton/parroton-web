'use client';

import { KpiDialog } from '@components/kpi/kpi-dialog';
import { OrLoader } from '@components/loader/loader';
import { useVaultData } from '@hooks/use-vault-data';
import { useVaults } from '@hooks/use-vaults';
import { useTranslation } from '@i18n/client';
import { Language } from '@i18n/settings';
import { ChevronLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  lng: Language;
  vaultAddress: string;
}

export const VaultHeader = ({ lng, vaultAddress }: Props) => {
  const { t } = useTranslation({ lng, ns: 'form' });
  const { vaults } = useVaults();
  const { vault, error: vaultError } = useVaultData(vaultAddress);
  const { back } = useRouter();

  return (
    <div className='custom-vault-header gap-5 font-semibold'>
      <div>
        {(!vaults || vaults.length > 1) && (
          <button className='flex items-center text-custom-link' onClick={back}>
            <ChevronLeftIcon size={16} />
            <span>{t('back')}</span>
          </button>
        )}
      </div>
      <div className='flex justify-center'>
        <OrLoader
          animation={!vaultError && !vault}
          value={vault}
          modifier={({ name }) => (
            <p className='overflow-hidden text-ellipsis text-center'>{name}</p>
          )}
        />
      </div>
      <div className='flex justify-end'>
        <OrLoader
          animation={!vaultError && !vault}
          value={vault}
          modifier={({ kpis }) => <KpiDialog values={kpis} lng={lng} />}
        />
      </div>
    </div>
  );
};
