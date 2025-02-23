import { ESCROW, PRICES, PRICES_SOLJUP, STAKE_API } from "@/lib/routes";
import { HeadPrices, VaultSelection } from "@/lib/types";
import useSWR, { mutate } from "swr";
import axios from "axios";
import { useActivityDetection } from "./useActivityDetection";

export function useFetchSOLJUPPrice() {
  const isActive = useActivityDetection();

  const { data, error, isLoading } = useSWR<HeadPrices[]>(
    isActive ? PRICES_SOLJUP : null,
    async () => {
      const response = await axios.get<HeadPrices[]>(PRICES_SOLJUP);
      return response.data;
    },
    {
      refreshInterval: isActive ? 11000 : 0,
      revalidateIfStale: true,
    }
  );

  return {
    data,
    isLoading: isLoading && isActive,
    error,
  };
}

export function useFetchTokenMetadataAndPrice(mint: string) {
  const isActive = useActivityDetection();
  const swrKey = mint && isActive ? [PRICES, mint] : null;
  const { data, error, isLoading } = useSWR(
    swrKey,
    async ([url, mintAddress]) => {
      if (!mintAddress) return null;

      const response = await axios.post(url, {
        mint: mintAddress,
      });
      return response.data;
    },
    {
      refreshInterval: isActive ? 16000 : 0,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
      dedupingInterval: 16000,
      keepPreviousData: true,
      isPaused: () => !isActive,
    }
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}

export function useFetchWalletEscrowData(
  wallet: string,
  vault: VaultSelection | undefined | null,
  tokenDecimals: number | undefined
) {
  const isActive = useActivityDetection();
  const swrKey =
    wallet && isActive && vault && tokenDecimals
      ? [wallet, vault.token_a_mint]
      : null;

  const { data, error, isLoading } = useSWR(swrKey, async ([walletAddress]) => {
    const response = await axios.post(ESCROW, {
      wallet: walletAddress,
      vault: vault,
      tokenDecimal: tokenDecimals,
    });
    return response.data;
  });

  return {
    data,
    isLoading,
    error,
  };
}

export function useFetchStakePercentages() {
  const isActive = useActivityDetection();
  const { data, error, isLoading } = useSWR(
    isActive ? STAKE_API : null,
    async () => {
      const response = await axios.get(STAKE_API);
      return response.data;
    },
    {
      revalidateOnFocus: true,
      revalidateOnMount: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      refreshInterval: 0,
      dedupingInterval: 0,
    }
  );

  return {
    data,
    isLoading: isLoading && isActive,
    error,
  };
}
