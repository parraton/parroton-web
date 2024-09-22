import { domain, miniAppLink } from '@config/links';
import { useTonAddress } from '@tonconnect/ui-react';
import { useInitData } from '@vkruglikov/react-telegram-web-app';
import { useCallback } from 'react';

const copyToClipboard = async (data: string) => {
  await navigator.clipboard.writeText(data);
};

export const useCopyReferralLink = (miniApp: boolean, onAfterCopy?: () => void) => {
  const tonAddress = useTonAddress();
  const [unsafe] = useInitData();
  const userId = unsafe?.user?.id;
  const miniAppRefLink = userId ? `${miniAppLink}?startapp=${userId}` : undefined;
  const webAppRefLink = tonAddress ? `${domain}?ref=${tonAddress}` : undefined;
  const link = miniApp ? miniAppRefLink : webAppRefLink;

  const copyLink = useCallback(async () => {
    await copyToClipboard(link ?? '');

    onAfterCopy?.();
  }, [link, onAfterCopy]);

  return { link, copyLink };
};
