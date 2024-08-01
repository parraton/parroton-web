import { Card } from '@UI/card';
import { ComponentProps } from 'react';
import { cn } from '@lib/utils';

export function GlassCard({ children, className, ...rest }: ComponentProps<typeof Card>) {
  return (
    <Card className={cn('glass-card', className)} {...rest}>
      {children}
    </Card>
  );
}
