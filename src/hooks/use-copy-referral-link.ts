import { domain, miniAppLink } from '@config/links';
import { useTonAddress } from '@tonconnect/ui-react';
import { useCallback } from 'react';

const copyToClipboard = async (data: string) => {
  await navigator.clipboard.writeText(data);
};

export const useCopyReferralLink = (miniApp: boolean, onAfterCopy?: () => void) => {
  const referral = useTonAddress();
  const link = miniApp ? `${miniAppLink}?startapp=${referral}` : `${domain}?ref=${referral}`;

  const copyLink = useCallback(async () => {
    await copyToClipboard(link);

    onAfterCopy?.();
  }, [link, onAfterCopy]);

  return { link, copyLink };
};
