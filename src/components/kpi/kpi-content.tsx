import type { VaultKpis } from '@hooks/use-vaults';
import { useTranslation } from '@i18n/client';
import { formatCurrency, formatPercentage } from '@lib/utils';
import { useMemo } from 'react';
import { KPIProgress, KpiType } from './kpi-progress';
import type { Language } from '@i18n/settings';

interface KpiContentProps {
  values: VaultKpis;
  lng?: Language;
}

export const KpiContent = ({ values, lng }: KpiContentProps) => {
  const { t } = useTranslation({ ns: 'kpi' });
  const { tvl, liquidityFraction, revenue } = values;

  const progressEntries = useMemo(
    () => [
      {
        key: 'tvl',
        title: t('goals.tvl', { tvl_goal: formatCurrency(tvl.target, lng) }),
        values: tvl,
        type: KpiType.Dollar,
      },
      {
        key: 'shares',
        title: t('goals.shares', {
          share_goal: formatPercentage(Number(liquidityFraction.target) * 100),
        }),
        values: liquidityFraction,
        type: KpiType.Percent,
      },
      {
        key: 'revenue',
        title: t('goals.revenue', { revenue_goal: formatCurrency(revenue.target, lng) }),
        values: revenue,
        type: KpiType.Dollar,
      },
    ],
    [liquidityFraction, lng, revenue, t, tvl],
  );

  return (
    <div className='flex flex-1 flex-col gap-2'>
      {progressEntries.map(({ key, title, values, type }) => (
        <KPIProgress
          key={key}
          title={title}
          value={Number(values.current) * (type === KpiType.Percent ? 100 : 1)}
          total={Number(values.target) * (type === KpiType.Percent ? 100 : 1)}
          type={type}
          lng={lng}
        />
      ))}
    </div>
  );
};
KpiContent.displayName = 'KpiContent';
