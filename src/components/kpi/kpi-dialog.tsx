'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@UI/dialog';

import { KPIProgress, KpiType } from '@components/kpi/kpi-progress';
import { formatCurrency } from '@lib/utils';
import { useTranslation } from '@i18n/client';
import { goals } from '@config/goals.config';

type KpiDialogProps = {
  tvl: string;
  share: string;
  revenue: string;
};

export function KpiDialog({ tvl, share, revenue }: KpiDialogProps) {
  const { t } = useTranslation({ ns: 'kpi' });

  return (
    <Dialog>
      <DialogTrigger className='z-10'>
        <p className='bg-none font-semibold text-[#19A7E7]'>{t('wanna_know_our_goals')}</p>
      </DialogTrigger>
      <DialogContent className='custom-dialog glass-card sm:max-w-md'>
        <div className='p-6'>
          <DialogHeader>
            <DialogTitle className='uppercase'>{t('our_kpi')}</DialogTitle>
            <DialogDescription>{t('reach_together')}</DialogDescription>
          </DialogHeader>
          <div className='mt-4 flex flex-col gap-6'>
            <KPIProgress
              title={t('goals.tvl', { tvl_goal: formatCurrency(goals.tvl) })}
              value={Number(tvl)}
              total={goals.tvl}
              type={KpiType.Dollar}
            />
            <KPIProgress
              title={t('goals.shares', { share_goal: goals.share })}
              value={Number(share) * 100}
              total={goals.share}
              type={KpiType.Percent}
            />
            <KPIProgress
              title={t('goals.revenue', { revenue_goal: formatCurrency(goals.revenue) })}
              value={Number(revenue)}
              total={goals.revenue}
              type={KpiType.Dollar}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
