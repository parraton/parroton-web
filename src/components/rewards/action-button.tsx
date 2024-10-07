import { cn } from '@lib/utils';
import { ButtonV2 } from '@UI/button-v2';

export const ActionButton = ({
  className,
  ...restProps
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <ButtonV2
    className={cn(className, 'w-auto min-w-16 max-w-32 !py-2 text-sm font-extrabold leading-tight')}
    {...restProps}
  />
);
