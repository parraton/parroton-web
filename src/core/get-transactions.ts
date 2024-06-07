import TonWeb from 'tonweb';

const tonweb = new TonWeb(
  new TonWeb.HttpProvider(process.env.NEXT_PUBLIC_TONCENTER_URL, {
    apiKey: process.env.NEXT_PUBLIC_TONCENTER_API_KEY,
  }),
);

type Options = {
  limit?: number;
};

export const getTransactions = (
  address: string,
  { limit }: Options = {},
): ReturnType<typeof tonweb.getTransactions> =>
  tonweb.provider.getTransactions(address, limit ?? 1, void 0, void 0, void 0, true);
