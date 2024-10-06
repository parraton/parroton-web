import { cn } from '@lib/utils';

export const ButtonV2 = ({
  className,
  type = 'button',
  ...restProps
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn('w-full rounded-xl bg-custom-button py-3 font-semibold', className)}
    type={type}
    {...restProps}
  />
);
