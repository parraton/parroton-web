"use client";

import {useConnection} from "@hooks/use-connection";
import {Button} from "@UI/button";
import {poolDeposit} from "@core/scene";
import {successTransaction} from "@utils/sender";
import {firstValueFrom} from "rxjs";
import {fromNano} from "@ton/core";
import {toast} from "sonner";
import Link from "next/link";

export function PoolDeposit() {
  const {sender, connected} = useConnection();

  const handleClick = async () => {
    const {
      jettonAmount,
      tonAmount,
    } = await poolDeposit(sender);

    const hash = await firstValueFrom(successTransaction);

    toast.info(
      <div>
        <div>Transaction has been sent</div>
        <div>Deposited: {fromNano(jettonAmount)} jUSDT, {fromNano(tonAmount)} TON</div>
        <Link href={`${process.env.NEXT_PUBLIC_TONVIEWER_URL}/transaction/${hash}`} target='_blank'>View
          transaction</Link>
      </div>
    );
  }

  return (
    <div>
      {connected ? <Button onClick={handleClick}>Get lp</Button> : <div>Not connected</div>}
    </div>
  );
}