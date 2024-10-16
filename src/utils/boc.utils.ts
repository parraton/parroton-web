import { Cell } from '@ton/core';
// eslint-disable-next-line unicorn/prefer-node-protocol
import { Buffer } from 'buffer';

const bocToCell = (boc: string) => Cell.fromBoc(Buffer.from(boc, 'base64'))[0];

export const bocToHash = (boc: string) => bocToCell(boc).hash(0).toString('hex');
