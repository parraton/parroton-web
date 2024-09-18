'use client';

import { FC, ReactNode, useLayoutEffect, useMemo, useRef } from 'react';

import styles from './loader.module.scss';
import { cn } from '@lib/utils';
import { useIsConnectionRestored } from '@tonconnect/ui-react';

interface DashPlugProps {
  zoom?: number;
  animation?: boolean;
  className?: string;
  quantity?: number;
}

const DASH_QUANTITY = 4;
const DEFAULT_ZOOM = 1;

const Loader: FC<DashPlugProps> = ({ zoom, animation, className, quantity }) => {
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

export function OrLoader<T>(props: {
  animation?: boolean;
  value?: T | null;
  //eslint-disable-next-line no-unused-vars
  modifier?: (_: T) => ReactNode;
}) {
  const isConnectionRestored = useIsConnectionRestored();

  const affected = props.animation || isConnectionRestored;
  return props.value == null ? (
    <Loader animation={Boolean(affected)} />
  ) : props.modifier ? (
    props.modifier(props.value)
  ) : (
    props.value
  );
}
