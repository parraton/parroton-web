/* eslint-disable  no-unused-vars */
import { Progress } from '@UI/progress';
import type { Language } from '@i18n/settings';
import { formatCurrency, formatPercentage } from '@lib/utils';

export enum KpiType {
  Percent = 'percent',
  Dollar = 'dollar',
}

const KpiTypeToModifier = {
  [KpiType.Percent]: formatPercentage,
  [KpiType.Dollar]: formatCurrency,
};

type KPIProgressProps = {
  title: string;
  value: number;
  total: number;
  type: KpiType;
  lng?: Language;
};

const zero = 0;

export function KPIProgress({ title, value, total, type, lng }: KPIProgressProps) {
  const percentage = Math.min(value / total, 1) * 100;

  const valueToShow = KpiTypeToModifier[type](value, lng);

  return (
    <div className='flex flex-col gap-1'>
      <h3 className='font-semibold'>{title}</h3>
      <Progress value={percentage} />
      <div className='flex justify-between text-sm text-[#707070]'>
        <p>{zero}</p>
        <p className='text-sm font-semibold text-accent-foreground'>{valueToShow}</p>
        <p>{total}</p>
      </div>
    </div>
  );
}
