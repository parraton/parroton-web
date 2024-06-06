import Link from 'next/link';

export interface TonviewerLinkProps {
  hash: string;
}

export function TonviewerLink({ hash }: TonviewerLinkProps) {
  return (
    <Link href={`${process.env.NEXT_PUBLIC_TONVIEWER_URL}/transaction/${hash}`}>
      View transaction
    </Link>
  );
}
