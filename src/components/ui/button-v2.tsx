import { cn } from '@lib/utils';

export const ButtonV2 = ({
  className,
  type = 'button',
  ...restProps
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      'w-full rounded-xl bg-custom-button px-2 py-3 font-semibold disabled:opacity-75',
      className,
    )}
    type={type}
    {...restProps}
  />
);
