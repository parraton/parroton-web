'use client';

import { FC, ReactNode, useLayoutEffect, useMemo, useRef } from 'react';

import styles from './loader.module.scss';
import { cn } from '@lib/utils';
import { useConnection } from '@hooks/use-connection';

export interface DashPlugProps {
  zoom?: number;
  animation?: boolean;
  className?: string;
  quantity?: number;
}

const DASH_QUANTITY = 4;
const DEFAULT_ZOOM = 1;

export const Loader: FC<DashPlugProps> = ({ zoom, animation, className, quantity }) => {
  const container = useRef<HTMLDivElement>(null);

  const wrapperClassName = cn(
    styles['inline-loading'],
    {
      [styles.animation]: animation !== false,
    },
    className,
  );

  useLayoutEffect(() => {
    container.current?.style.setProperty('--zoom', `${zoom ?? DEFAULT_ZOOM}`);
  }, [zoom]);

  const iterator = useMemo(() => {
    return new Array(quantity ?? DASH_QUANTITY).fill(null).map((_, index) => index);
  }, [quantity]);

  return (
    <div ref={container} className={wrapperClassName}>
      {iterator.map((key) => (
        <div className={styles.dash} key={key} />
      ))}
    </div>
  );
};

//eslint-disable-next-line no-unused-vars
export function OrLoader<T>(props: { value?: T | null; modifier?: (_: T) => ReactNode }) {
  const { connected } = useConnection();

  return props.value == null ? (
    <Loader animation={connected} />
  ) : props.modifier ? (
    props.modifier(props.value)
  ) : (
    props.value
  );
}
