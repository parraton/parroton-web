import { getVault } from '@core';
import { useDeposit } from '@hooks/use-deposit';
import { usePreferredCurrency } from '@hooks/use-preferred-currency';
import { useSharesBalance } from '@hooks/use-shares-balance';
import { useTonPrice } from '@hooks/use-ton-price';
import { useVaultData } from '@hooks/use-vault-data';
import { useWithdraw } from '@hooks/use-withdraw';
import { useTranslation } from '@i18n/client';
import { FALLBACK_MAX_ASSET_VALUE, FALLBACK_TON_PRICE } from '@lib/constants';
import {
  formatCurrency,
  formatNumberWithDigitsLimit,
  getAmountAsStringValidationSchema,
} from '@lib/utils';
import { Address, fromNano, toNano } from '@ton/core';
import { useTonAddress } from '@tonconnect/ui-react';
import { Currency } from '@types';
import BigNumber from 'bignumber.js';
import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';
import { z } from 'zod';
import { toFormikValidate } from 'zod-formik-adapter';
import { MainnetAction } from './types';
import { useLpBalance } from '@hooks/use-lp-balance';

const getVaultContract = ([, vaultAddress]: [string, string]) =>
  getVault(Address.parse(vaultAddress));

const INPUT_DECIMAL_PLACES = 2;
const roundInputValue = (value: BigNumber) =>
  value.decimalPlaces(INPUT_DECIMAL_PLACES, BigNumber.ROUND_FLOOR);

export const useFormData = (vaultAddress: string) => {
  const { t, lng } = useTranslation({ ns: 'form' });
  const { vault, error: vaultError } = useVaultData(vaultAddress);
  const { balance: lpBalance, error: lpBalanceError } = useLpBalance(vaultAddress);
  const { balance: plpBalances, error: plpBalancesError } = useSharesBalance(vaultAddress);
  const { tonPrice } = useTonPrice();
  const { preferredCurrency: currency } = usePreferredCurrency();
  const walletAddress = useTonAddress();
  const { deposit } = useDeposit();
  const { withdraw } = useWithdraw();

  const [inputAmount, setInputAmount] = useState<string>('');
  const setInputAmountDebounced = useDebouncedCallback(setInputAmount, 500);

  const [action, setAction] = useState<MainnetAction>('deposit');
  const isDeposit = action === 'deposit';

  const fallbackMaxValueUsd = useMemo(
    () => new BigNumber(FALLBACK_MAX_ASSET_VALUE).times(tonPrice ?? FALLBACK_TON_PRICE),
    [tonPrice],
  );

  const maxDepositValueUsd = useMemo(() => {
    if (!lpBalance || !vault) {
      return fallbackMaxValueUsd;
    }

    return new BigNumber(lpBalance).times(vault.lpPriceUsd);
  }, [fallbackMaxValueUsd, lpBalance, vault]);
  const maxWithdrawValueUsd = useMemo(() => {
    if (!plpBalances || !vault) {
      return fallbackMaxValueUsd;
    }

    return new BigNumber(plpBalances.sharesBalance).times(vault.plpPriceUsd);
  }, [plpBalances, fallbackMaxValueUsd, vault]);

  const maxDepositValueTon = useMemo(
    () =>
      maxDepositValueUsd && tonPrice !== undefined
        ? maxDepositValueUsd.div(tonPrice)
        : new BigNumber(FALLBACK_MAX_ASSET_VALUE),
    [maxDepositValueUsd, tonPrice],
  );
  const maxWithdrawValueTon = useMemo(
    () =>
      maxWithdrawValueUsd && tonPrice !== undefined
        ? maxWithdrawValueUsd.div(tonPrice)
        : new BigNumber(FALLBACK_MAX_ASSET_VALUE),
    [maxWithdrawValueUsd, tonPrice],
  );

  const maxValueUsd = useMemo(
    () => roundInputValue(isDeposit ? maxDepositValueUsd : maxWithdrawValueUsd),
    [isDeposit, maxDepositValueUsd, maxWithdrawValueUsd],
  );
  const maxValueTon = useMemo(
    () => roundInputValue(isDeposit ? maxDepositValueTon : maxWithdrawValueTon),
    [isDeposit, maxDepositValueTon, maxWithdrawValueTon],
  );
  const maxDepositValue = useMemo(
    () => roundInputValue(currency === Currency.USD ? maxDepositValueUsd : maxDepositValueTon),
    [currency, maxDepositValueTon, maxDepositValueUsd],
  );
  const maxWithdrawValue = useMemo(
    () => roundInputValue(currency === Currency.USD ? maxWithdrawValueUsd : maxWithdrawValueTon),
    [currency, maxWithdrawValueTon, maxWithdrawValueUsd],
  );
  const maxValue = currency === Currency.USD ? maxValueUsd : maxValueTon;
  console.log('oy vey 1', vault, lpBalance, plpBalances, tonPrice);

  const { data: vaultContract } = useSWR(['vault-contract', vaultAddress], getVaultContract, {
    shouldRetryOnError: true,
    errorRetryInterval: 5000,
    suspense: false,
  });

  const amountValidationSchema = useMemo(
    () =>
      getAmountAsStringValidationSchema(
        {
          required: t('validation.required'),
          invalidFormat: t('validation.invalid_format'),
          min: (amount) =>
            t(isDeposit ? 'validation.min_deposit' : 'validation.min_withdraw', {
              minAmount: amount,
            }),
          max: (amount) =>
            t(isDeposit ? 'validation.max_deposit' : 'validation.max_withdraw', {
              maxAmount: amount,
            }),
        },
        {
          required: true,
          min: '0.009',
          max: maxValue.toString(),
        },
      ),
    [isDeposit, maxValue, t],
  );
  const validate = useMemo(
    () =>
      toFormikValidate(
        z.object({
          action: z.enum(['deposit', 'withdraw']),
          amount: amountValidationSchema,
        }),
      ),
    [amountValidationSchema],
  );

  const fetchSharesEquivalent = useCallback(
    async ([, inputAmountLp, vaultAddress]: [string, string, string]) => {
      const x = await (
        vaultContract ?? (await getVaultContract(['', vaultAddress]))
      ).getEstimatedSharesAmount(toNano(inputAmountLp));
      console.log('oy vey 2', inputAmountLp, fromNano(x));

      return fromNano(x);
    },
    [vaultContract],
  );
  const fetchLpEquivalent = useCallback(
    async ([, inputAmountPlp, vaultAddress]: [string, string, string]) => {
      const x = await (
        vaultContract ?? (await getVaultContract(['', vaultAddress]))
      ).getEstimatedLpAmount(toNano(inputAmountPlp));
      console.log('oy vey 3', inputAmountPlp, fromNano(x));

      return fromNano(x);
    },
    [vaultContract],
  );

  const inputAmountLpOrPlp = useMemo(() => {
    const parsedInputAmount = new BigNumber(inputAmount.replace(',', '.'));

    if (!parsedInputAmount.isFinite() || !vault) {
      return '0';
    }

    return parsedInputAmount
      .times(currency === Currency.TON ? tonPrice ?? FALLBACK_TON_PRICE : 1)
      .div(isDeposit ? vault.lpPriceUsd : vault.plpPriceUsd)
      .decimalPlaces(9, BigNumber.ROUND_FLOOR)
      .toString();
  }, [currency, inputAmount, isDeposit, tonPrice, vault]);
  const { data: estimatedOutput, error: estimatedOutputError } = useSWR(
    ['estimated-lp-or-plp', inputAmountLpOrPlp, vaultAddress, isDeposit],
    isDeposit ? fetchSharesEquivalent : fetchLpEquivalent,
    {
      refreshInterval: 10_000,
      shouldRetryOnError: true,
      errorRetryInterval: 1000,
      suspense: false,
    },
  );

  const underlyingTokensSymbols = vault?.lpMetadata.name.replace(/(Parraton: |DeDust Pool: )/, '');
  const shortInputSymbol = isDeposit ? 'LP' : 'PLP';
  const shortOutputSymbol = isDeposit ? 'PLP' : 'LP';
  const expectedYearlyYield = useMemo(() => {
    const parsedInputAmount = new BigNumber(inputAmount);

    if (!parsedInputAmount.isFinite() || !vault || !isDeposit) {
      return null;
    }

    const rawResult = parsedInputAmount.times(vault.apy).div(100);

    return currency === Currency.USD
      ? formatCurrency(rawResult.toString(), lng)
      : `${formatNumberWithDigitsLimit(rawResult.toString(), lng, 4)} TON`;
  }, [currency, inputAmount, isDeposit, lng, vault]);

  const inputToOutputExchangeRate = useMemo(() => {
    const inputAmount = new BigNumber(inputAmountLpOrPlp);
    const outputAmount = new BigNumber(estimatedOutput ?? '0');

    if (inputAmount.isZero() || outputAmount.isZero()) {
      return;
    }

    return formatNumberWithDigitsLimit(inputAmount.div(outputAmount).toString(), lng, 4);
  }, [estimatedOutput, inputAmountLpOrPlp, lng]);

  const estimatedOutputLoading = !estimatedOutput && !estimatedOutputError;
  const plpBalanceLoading = !plpBalancesError && plpBalances === undefined;
  const lpBalanceLoading = !lpBalanceError && lpBalance === undefined;
  const vaultIsLoading = !vaultError && !vault;

  return {
    setInputAmount: setInputAmountDebounced,
    setAction,
    apy: vault?.apy,
    maxValueTon: maxValueTon.toString(),
    maxValue: maxValue.toString(),
    maxDepositValue: maxDepositValue.toString(),
    maxWithdrawValue: maxWithdrawValue.toString(),
    validate,
    shouldShowConnectButton: !walletAddress,
    estimatedOutput: estimatedOutput,
    estimatedOutputLoading,
    inputBalance: isDeposit ? lpBalance : plpBalances?.sharesBalance,
    inputBalanceLoading: isDeposit ? lpBalanceLoading : plpBalanceLoading,
    shortInputSymbol,
    shortOutputSymbol,
    expectedYearlyYield,
    vaultIsLoading,
    inputAmountLpOrPlp,
    inputToOutputExchangeRate,
    fullInputSymbol: underlyingTokensSymbols
      ? `${underlyingTokensSymbols}\u00A0${shortInputSymbol}`
      : undefined,
    doAction: isDeposit ? deposit : withdraw,
  };
};
