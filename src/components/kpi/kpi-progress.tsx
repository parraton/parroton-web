import { Progress } from '@UI/progress';

type KPIProgressProps = {
  title: string;
  value: number;
  total: number;
};

export function KPIProgress({ title, value, total }: KPIProgressProps) {
  const percentage = (value / total) * 100;

  return (
    <div className='flex flex-col gap-1'>
      <h3 className='text-sm font-semibold'>{title}</h3>
      <Progress value={percentage} />
      <div className='flex justify-between text-[12px] text-[#707070]'>
        <p>0</p>
        <p className='text-[12px] font-semibold text-accent-foreground'>{value}</p>
        <p>{total}</p>
      </div>
    </div>
  );
}
