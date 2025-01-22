import {
  HeadPrices,
  M3M3_VaultData,
  TokenMetadata,
  VaultOptions,
  VaultSelection,
  WalletData,
} from "./types";

export async function getVaults(): Promise<VaultOptions[]> {
  try {
    const response = await fetch(
      "https://stake-for-fee-api.meteora.ag/vault/all"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();

    const filteredVaults = responseData.data
      .filter(
        (vault: { current_reward_usd: number }) =>
          vault.current_reward_usd >= 10000
      )
      .map(
        (vault: {
          vault_address: string;
          token_a_symbol: string;
          token_a_mint: string;
          current_reward_usd: number;
        }) => ({
          vault_address: vault.vault_address,
          token_a_symbol: vault.token_a_symbol,
          token_a_mint: vault.token_a_mint,
          current_reward_usd: vault.current_reward_usd,
        })
      );

    const sortedVaults = filteredVaults.sort(
      (a: { token_a_symbol: string }, b: { token_a_symbol: string }) => {
        if (a.token_a_symbol === "LGTB") return -1;
        if (b.token_a_symbol === "LGTB") return 1;
        return 0;
      }
    );

    return sortedVaults;
  } catch (error) {
    console.error("Error fetching vaults:", error);
    return [];
  }
}

export async function getVaultInfo(
  vaultAddress: string
): Promise<M3M3_VaultData> {
  try {
    const response = await fetch(
      `https://stake-for-fee-api.meteora.ag/vault/${vaultAddress}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: M3M3_VaultData = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching vault info:", error);
    throw error;
  }
}

export async function getTokenMetaData(mint?: string): Promise<TokenMetadata> {
  try {
    const response = await fetch("/api/token/metadata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mint }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch token metadata");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    throw error;
  }
}

export async function getEscrowAccont(
  wallet: string,
  selectedVault: VaultSelection
): Promise<WalletData> {
  try {
    const response = await fetch("/api/escrow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ wallet, selectedVault }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch escrow data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching escrow data:", error);
    throw error;
  }
}

export async function getSOLJUPPrice(): Promise<HeadPrices[]> {
  try {
    const response = await fetch(
      "https://api.jup.ag/price/v2?ids=JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN,So11111111111111111111111111111111111111112"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = await response.json();

    const prices: HeadPrices[] = Object.entries(data).map(([key, value]) => ({
      key,
      price: (value as { price: string }).price,
    }));

    return prices;
  } catch (error) {
    console.error("Error fetching SOL price:", error);
    throw error;
  }
}
