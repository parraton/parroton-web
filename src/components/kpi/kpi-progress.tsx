/* eslint-disable  no-unused-vars */
import { Progress } from '@UI/progress';
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
};

const zero = 0;

export function KPIProgress({ title, value, total, type }: KPIProgressProps) {
  const percentage = (value / total) * 100;

  const valueToShow = KpiTypeToModifier[type](value);

  if (type === KpiType.Percent) {
    console.log({
      title,
      percentage,
      valueToShow,
      total,
    });
  }

  return (
    <div className='flex flex-col gap-1'>
      <h3 className='text-sm font-semibold'>{title}</h3>
      <Progress value={percentage} />
      <div className='flex justify-between text-[12px] text-[#707070]'>
        <p>{zero}</p>
        <p className='text-[12px] font-semibold text-accent-foreground'>{valueToShow}</p>
        <p>{total}</p>
      </div>
    </div>
  );
}
