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

const getVaultContract = ([, vaultAddress]: [string, string]) =>
  getVault(Address.parse(vaultAddress));

export const useFormData = (vaultAddress: string) => {
  const { t, lng } = useTranslation({ ns: 'form' });
  const { vault, error: vaultError } = useVaultData(vaultAddress);
  const { balance: balances, error: balancesError } = useSharesBalance(vaultAddress);
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

  console.log('oy vey 1', vault, balances, action, tonPrice);
  const maxDepositValueUsd = useMemo(() => {
    if (!balances || !vault) {
      return fallbackMaxValueUsd;
    }

    return new BigNumber(balances.lpBalance).times(vault.lpPriceUsd);
  }, [balances, fallbackMaxValueUsd, vault]);
  const maxWithdrawValueUsd = useMemo(() => {
    if (!balances || !vault) {
      return fallbackMaxValueUsd;
    }

    return new BigNumber(balances.sharesBalance).times(vault.plpPriceUsd);
  }, [balances, fallbackMaxValueUsd, vault]);
  const maxValueUsd = isDeposit ? maxDepositValueUsd : maxWithdrawValueUsd;

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
  const maxValueTon = isDeposit ? maxDepositValueTon : maxWithdrawValueTon;

  const maxDepositValue = currency === Currency.USD ? maxDepositValueUsd : maxDepositValueTon;
  const maxWithdrawValue = currency === Currency.USD ? maxWithdrawValueUsd : maxWithdrawValueTon;
  const maxValue = currency === Currency.USD ? maxValueUsd : maxValueTon;

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

  const inputAmountLpOrPlp = useMemo(() => {
    if (amountValidationSchema.safeParse(inputAmount).success === false || !vault) {
      return '0';
    }

    return new BigNumber(inputAmount)
      .times(currency === Currency.TON ? tonPrice ?? FALLBACK_TON_PRICE : 1)
      .div(isDeposit ? vault.lpPriceUsd : vault.plpPriceUsd)
      .decimalPlaces(9, BigNumber.ROUND_FLOOR)
      .toString();
  }, [amountValidationSchema, currency, inputAmount, isDeposit, tonPrice, vault]);
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
    if (amountValidationSchema.safeParse(inputAmount).success === false || !vault || !isDeposit) {
      return null;
    }

    const rawResult = new BigNumber(inputAmount).times(vault.apy).div(100);

    return currency === Currency.USD
      ? formatCurrency(rawResult.toString(), lng)
      : `${formatNumberWithDigitsLimit(rawResult.toString(), lng, 4)} TON`;
  }, [amountValidationSchema, currency, inputAmount, isDeposit, lng, vault]);

  const inputToOutputExchangeRate = useMemo(() => {
    const inputAmount = new BigNumber(inputAmountLpOrPlp);
    const outputAmount = new BigNumber(estimatedOutput ?? '0');

    if (inputAmount.isZero() || outputAmount.isZero()) {
      return;
    }

    return formatNumberWithDigitsLimit(inputAmount.div(outputAmount).toString(), lng, 4);
  }, [estimatedOutput, inputAmountLpOrPlp, lng]);

  const estimatedOutputLoading = !estimatedOutput && !estimatedOutputError;
  const balancesLoading = !balancesError && balances === undefined;
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
    outputBalance: isDeposit ? balances?.sharesBalance : balances?.lpBalance,
    balancesLoading,
    shortInputSymbol,
    shortOutputSymbol,
    expectedYearlyYield,
    vaultIsLoading,
    inputAmountLpOrPlp,
    inputToOutputExchangeRate,
    fullInputSymbol: underlyingTokensSymbols
      ? `${underlyingTokensSymbols}\u00A0${shortOutputSymbol}`
      : undefined,
    doAction: isDeposit ? deposit : withdraw,
  };
};
