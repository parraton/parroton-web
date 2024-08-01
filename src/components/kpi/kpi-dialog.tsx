import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@UI/dialog';

import { KPIProgress } from '@components/kpi/kpi-progress';

export function KpiDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <p className='bg-none font-semibold text-[#19A7E7]'>Wanna know our goals?</p>
      </DialogTrigger>
      <DialogContent className='custom-dialog glass-card sm:max-w-md'>
        <div className='p-6'>
          <DialogHeader>
            <DialogTitle className='uppercase'>Our KPI</DialogTitle>
            <DialogDescription>Let’s reach them together</DialogDescription>
          </DialogHeader>
          <div className='mt-4 flex flex-col gap-6'>
            <KPIProgress title='1M TVL' value={123_456} total={1_000_000} />
            <KPIProgress title='X% of Dedust Lp' value={7} total={30} />
            <KPIProgress title='$ Revenue' value={12_345} total={500_000} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
