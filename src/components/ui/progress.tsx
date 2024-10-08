'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@lib/utils';

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <div
    style={{
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      '--right': `${100 - (value || 0)}%`,
    }}
    className='progress-indicator'
  >
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-3 w-full overflow-hidden rounded-full bg-custom-content',
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn('size-full flex-1 bg-primary transition-all')}
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          background: `linear-gradient(92.69deg, rgb(var(--custom-link)) ${100 - (value || 0)}%, var(--custom-button) 100%)`,
        }}
      />
    </ProgressPrimitive.Root>
  </div>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
