import { PropsWithChildren, ReactNode } from 'react';
import { LayoutProviderHelper } from '@components/providers/layout-provider-helper';

//eslint-disable-next-line no-unused-vars
type RenderProps = ({ children }: PropsWithChildren) => JSX.Element;

export function LayoutProvider(props: { layout: RenderProps; injectedChildren: ReactNode }) {
  const { layout, injectedChildren } = props;

  return (
    <LayoutProviderHelper
      welcome={injectedChildren}
      other={layout({ children: injectedChildren })}
    />
  );
}
