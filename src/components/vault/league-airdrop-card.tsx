import { Vault } from '@hooks/use-vaults';
import { useTranslation } from '@i18n/client';
import { Language } from '@i18n/settings';
import { useInitData } from '@vkruglikov/react-telegram-web-app';
import Lottie from 'react-lottie';
import { ActionLink } from './action-link';
import animationData from './duck-animation.json';
import { miniAppLink } from '@config/links';
import { useMemo } from 'react';

interface LeagueAirdropCardProps {
  lng: Language;
  vaults: Vault[];
}

const airdropEnd = new Date(2024, 11, 17);

const endDateOrdinalSuffixes: Record<Intl.LDMLPluralRule, Record<Language, string>> = {
  one: {
    en: 'st',
    ua: '-го',
  },
  two: {
    en: 'nd',
    ua: '-го',
  },
  few: {
    en: 'rd',
    ua: '-го',
  },
  other: {
    en: 'th',
    ua: '-го',
  },
  zero: {
    en: 'th',
    ua: '-го',
  },
  many: {
    en: 'th',
    ua: '-го',
  },
};

export const LeagueAirdropCard = ({ lng, vaults }: LeagueAirdropCardProps) => {
  const [, initData] = useInitData();
  const { t } = useTranslation({ ns: 'vault-card' });

  const tonUsdtVault = useMemo(
    () =>
      vaults.find(({ name }) => {
        const underlyingTokensSymbols = name.replace(/(Parraton: |DeDust Pool: )/, '');

        return underlyingTokensSymbols === 'TON/USDT' || underlyingTokensSymbols === 'USDT/TON';
      }),
    [vaults],
  );

  const airdropEndFormatted = useMemo(() => {
    const airdropEndDay = airdropEnd.getDate();
    const ordinalPluralRule = new Intl.PluralRules(lng, { type: 'ordinal' }).select(airdropEndDay);

    return Intl.DateTimeFormat(lng, { month: 'long', day: 'numeric' })
      .format(airdropEnd)
      .replace(
        String(airdropEndDay),
        `${airdropEndDay}${endDateOrdinalSuffixes[ordinalPluralRule][lng]}`,
      );
  }, [lng]);

  return (
    <div className='glass-card flex w-full flex-col gap-4 p-4'>
      <h1 className='whitespace-pre-line text-center text-lg font-semibold'>
        {t('farm_open_league_airdrop', { date: airdropEndFormatted })}
      </h1>

      <div className='flex w-full items-center justify-evenly gap-2'>
        <div className='h-auto w-[100px]'>
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData,
            }}
            height={100}
            width={100}
            isClickToPauseDisabled
          />
        </div>
        <ol className='list-decimal font-medium leading-10'>
          <li>
            <ActionLink href='https://society.ton.org/the-open-league-new-year-airdrop'>
              {t('get_defi_badge')}
            </ActionLink>
          </li>
          <li>
            <ActionLink href={`/${lng}/${tonUsdtVault?.vaultAddressFormatted}`}>
              {t('deposit_liquidity_task_description')}
            </ActionLink>
          </li>
          <li>
            {initData ? (
              <ActionLink href={`/${lng}/rewards`}>{t('earn_more_points')}</ActionLink>
            ) : (
              <ActionLink href={miniAppLink}>{t('earn_more_points_in_telegram')}</ActionLink>
            )}
          </li>
        </ol>
      </div>
    </div>
  );
};
