// import { PublicKey } from "@solana/web3.js";
import { config } from "@config/config";
import { M3M3_VaultData, TokenMetadata, VaultOptions } from "./types";
import { Connection } from "@solana/web3.js";

// const m3m3_PROGRAM_ID = new PublicKey(
//   "FEESngU3neckdwib9X3KWqdL7Mjmqk9XNp3uh5JbP4KP"
// );
// const LGTB_TOKEN_MINT_ADDRESS = new PublicKey(
//   "2vFYpCh2yJhHphft1Z4XHdafEhj6XksyhFyH9tvTdKqf"
// );
// const LGTB_VAULT_ADDRESS = new PublicKey('ZxuHhk6X1nBP3A7vLPYrUSugsbxtCAqk5sm3W7eGFNk');

// const DYNAMIC_AMM_PROGRAM_ID = new PublicKey(
//   "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB"
// );

// const DYNAMIC_VAULT_PROGRAM_ID = new PublicKey(
//   "24Uqj9JCLxUeoC3hGfh5W3s9FM9uCHDS2SG3LYwBpyTi"
// );

// const METEORA_STAKING_PROGRAM_ID = new PublicKey(
//   "STK9HV9eCirYp3PSGwqGzuoEH7UBVkuLjQxmRt7yUT7"
// );

// const LGTB_POOL_ADDRESS = new PublicKey(
//   "HkkjwRtgtqepZd2uEZcmBoWK7JkxBVWCfXpq1GzLoToT"
// );

export const connection = new Connection(
  config.solana.mainnet as string,
  "confirmed"
);

export async function getVaults(): Promise<VaultOptions[]> {
  try {
    const response = await fetch(
      "https://stake-for-fee-api.meteora.ag/vault/all"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();

    return responseData.data
      .filter(
        (vault: { current_reward_usd: number }) =>
          vault.current_reward_usd >= 10000
      )
      .map(
        (vault: {
          vault_address: string;
          token_a_symbol: string;
          current_reward_usd: number;
        }) => ({
          vault_address: vault.vault_address,
          token_a_symbol: vault.token_a_symbol,
          current_reward_usd: vault.current_reward_usd,
        })
      );
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
    const response = await fetch(config.solana.mainnet as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "my-id",
        method: "getAsset",
        params: [mint],
      }),
    });
    const data = await response.json();

    if (!data.result) {
      throw new Error("No result in API response");
    }

    return data.result;
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    throw error;
  }
}

// export async function getParseWalletData(wallet: string) {

// }
