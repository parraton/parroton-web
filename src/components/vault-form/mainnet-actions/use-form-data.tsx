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
  formatNumber,
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
import { multiplyIfPossible } from '@utils/multiply-if-possible';

const getVaultContract = ([, vaultAddress]: [string, string]) =>
  getVault(Address.parse(vaultAddress));

const roundInputValue = (value: BigNumber, decimals: number) =>
  value.decimalPlaces(decimals, BigNumber.ROUND_FLOOR);

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

  const [action, setAction] = useState<MainnetAction>('deposit');
  const isDeposit = action === 'deposit';
  const inputAssetExchangeRate = isDeposit ? vault?.lpPriceUsd : vault?.plpPriceUsd;
  const outputAssetExchangeRate = isDeposit ? vault?.plpPriceUsd : vault?.lpPriceUsd;

  const fallbackMaxValueUsd = useMemo(
    () => new BigNumber(FALLBACK_MAX_ASSET_VALUE).times(inputAssetExchangeRate ?? 1),
    [inputAssetExchangeRate],
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

  const maxDepositValueLp = useMemo(
    () => new BigNumber(lpBalance ?? FALLBACK_MAX_ASSET_VALUE),
    [lpBalance],
  );
  const maxWithdrawValuePlp = useMemo(
    () => new BigNumber(plpBalances?.sharesBalance ?? FALLBACK_MAX_ASSET_VALUE),
    [plpBalances?.sharesBalance],
  );

  const maxValueUsd = useMemo(
    () => roundInputValue(isDeposit ? maxDepositValueUsd : maxWithdrawValueUsd, 2),
    [isDeposit, maxDepositValueUsd, maxWithdrawValueUsd],
  );
  const maxValueInputAsset = useMemo(
    () => roundInputValue(isDeposit ? maxDepositValueLp : maxWithdrawValuePlp, 9),
    [isDeposit, maxDepositValueLp, maxWithdrawValuePlp],
  );
  const maxDepositValue = currency === Currency.USD ? maxDepositValueUsd : maxDepositValueLp;
  const maxWithdrawValue = currency === Currency.USD ? maxWithdrawValueUsd : maxWithdrawValuePlp;
  const maxValue = currency === Currency.USD ? maxValueUsd : maxValueInputAsset;

  const [inputAmount, setInputAmount] = useState(maxValue.toString());
  const setInputAmountDebounced = useDebouncedCallback(setInputAmount, 500);

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
          min: new BigNumber(currency === Currency.USD ? 9e-3 : 9e-10).toFixed(),
          max: maxValue.toString(),
        },
      ),
    [currency, isDeposit, maxValue, t],
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

      return fromNano(x);
    },
    [vaultContract],
  );
  const fetchLpEquivalent = useCallback(
    async ([, inputAmountPlp, vaultAddress]: [string, string, string]) => {
      const x = await (
        vaultContract ?? (await getVaultContract(['', vaultAddress]))
      ).getEstimatedLpAmount(toNano(inputAmountPlp));

      return fromNano(x);
    },
    [vaultContract],
  );

  const inputAmountInTokens = useMemo(() => {
    const parsedInputAmount = new BigNumber(inputAmount.replace(',', '.'));

    if (!parsedInputAmount.isFinite()) {
      return '0';
    }

    const unroundedValue =
      currency === Currency.Tokens
        ? parsedInputAmount
        : parsedInputAmount.div(inputAssetExchangeRate ?? 1);

    return formatNumber(roundInputValue(unroundedValue, 9).toString(), lng);
  }, [currency, inputAmount, inputAssetExchangeRate, lng]);
  const inputAmountInUsd = useMemo(
    () =>
      formatCurrency(
        new BigNumber(inputAmountInTokens).times(inputAssetExchangeRate ?? 1).toString(),
        lng,
      ),
    [inputAmountInTokens, inputAssetExchangeRate, lng],
  );
  const { data: estimatedOutput, error: estimatedOutputError } = useSWR(
    ['estimated-lp-or-plp', inputAmountInTokens, vaultAddress, isDeposit],
    isDeposit ? fetchSharesEquivalent : fetchLpEquivalent,
    {
      refreshInterval: 10_000,
      shouldRetryOnError: true,
      errorRetryInterval: 1000,
      suspense: false,
    },
  );
  const estimatedOutputInUsd = useMemo(() => {
    const rawValue = multiplyIfPossible(outputAssetExchangeRate, estimatedOutput)?.toString();

    return rawValue && formatCurrency(rawValue, lng);
  }, [estimatedOutput, lng, outputAssetExchangeRate]);

  const underlyingTokensSymbols = vault?.lpMetadata.name.replace(/(Parraton: |DeDust Pool: )/, '');
  const shortInputSymbol = isDeposit ? 'LP' : 'PLP';
  const shortOutputSymbol = isDeposit ? 'PLP' : 'LP';
  const expectedYearlyYield = useMemo(() => {
    const parsedInputAmount = isDeposit ? new BigNumber(inputAmount) : maxDepositValue;

    if (!parsedInputAmount.isFinite() || !vault) {
      return null;
    }

    const rawResult = parsedInputAmount.times(vault.apy).div(100);

    return currency === Currency.USD
      ? formatCurrency(rawResult.toString(), lng)
      : `${formatNumberWithDigitsLimit(
          rawResult.times(vault.lpPriceUsd ?? 1).div(tonPrice ?? FALLBACK_TON_PRICE),
          lng,
          4,
        )} TON`;
  }, [currency, inputAmount, isDeposit, lng, maxDepositValue, tonPrice, vault]);

  const inputToOutputExchangeRate = useMemo(() => {
    const inputAmount = new BigNumber(inputAmountInTokens);
    const outputAmount = new BigNumber(estimatedOutput ?? '0');

    if (inputAmount.isZero() || outputAmount.isZero()) {
      return;
    }

    return formatNumberWithDigitsLimit(inputAmount.div(outputAmount).toString(), lng, 4);
  }, [estimatedOutput, inputAmountInTokens, lng]);

  const inputBalance = isDeposit ? lpBalance : plpBalances?.sharesBalance;
  const inputBalanceInUsd = useMemo(() => {
    const rawValue = multiplyIfPossible(inputBalance, inputAssetExchangeRate)?.toString();

    return rawValue && formatCurrency(rawValue, lng);
  }, [inputAssetExchangeRate, inputBalance, lng]);

  const estimatedOutputLoading = !estimatedOutput && !estimatedOutputError;
  const plpBalanceLoading = !plpBalancesError && plpBalances === undefined;
  const lpBalanceLoading = !lpBalanceError && lpBalance === undefined;
  const vaultIsLoading = !vaultError && !vault;

  return {
    setInputAmount: setInputAmountDebounced,
    setAction,
    apy: vault?.apy,
    maxValue: maxValue.toString(),
    maxDepositValue: maxDepositValue.toString(),
    maxWithdrawValue: maxWithdrawValue.toString(),
    validate,
    shouldShowConnectButton: !walletAddress,
    estimatedOutput,
    estimatedOutputInUsd,
    estimatedOutputLoading,
    inputBalance,
    inputBalanceInUsd,
    inputBalanceLoading: isDeposit ? lpBalanceLoading : plpBalanceLoading,
    shortInputSymbol,
    shortOutputSymbol,
    expectedYearlyYield,
    vaultIsLoading,
    inputAmountInTokens,
    inputAmountInUsd,
    inputAssetExchangeRate,
    inputToOutputExchangeRate,
    fullInputSymbol: underlyingTokensSymbols
      ? `${underlyingTokensSymbols}\u00A0${shortInputSymbol}`
      : undefined,
    preferredCurrency: currency,
    doAction: isDeposit ? deposit : withdraw,
  };
};
