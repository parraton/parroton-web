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

  }

  return (
    <div>
      {connected ? <Button onClick={handleClick}>Get lp</Button> : <div>Not connected</div>}
    </div>
  );
}