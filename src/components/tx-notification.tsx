import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@UI/dialog';
import { useEffect, useState } from 'react';
import { transactionModalSubject } from '@utils/sender';

const title = 'Transaction';
const description = 'Transaction in progress';
const text = 'Please wait while the transaction is being processed.';

export function TxNotification() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const subscription = transactionModalSubject.subscribe(() => {
      setOpen(true);
    });

    setTimeout(() => transactionModalSubject.next(), 3000);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='custom-dialog sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className='custom-toggler-list'>{text}</div>
      </DialogContent>
    </Dialog>
  );
}
