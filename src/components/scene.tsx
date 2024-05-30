'use client';

import { Button } from '@UI/button';
import { scene } from '@core/scene';
import { useConnection } from '@hooks/use-connection';
import { TonConnectButton } from '@tonconnect/ui-react';

export function Scene() {
  const { connected, sender } = useConnection();

  console.log({ connected, sender });

  if (!connected) {
    return <TonConnectButton />;
  }

  return (
    <div>
      <Button onClick={() => scene(sender)}>Scene</Button>
    </div>
  );
}
