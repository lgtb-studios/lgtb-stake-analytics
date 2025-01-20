import { PublicKey } from "@solana/web3.js";
import { config } from "@config/config";
import {
  HeadPrices,
  M3M3_VaultData,
  TokenMetadata,
  VaultOptions,
  VaultSelection,
  WalletData,
} from "./types";
import { Connection } from "@solana/web3.js";
import { formatTokenAmount } from "./utils";
import { StakeEscrow } from "./Models";
import { m3m3_PROGRAM_ID } from "./utils";

// const LGTB_TOKEN_MINT_ADDRESS = new PublicKey(
//   "2vFYpCh2yJhHphft1Z4XHdafEhj6XksyhFyH9tvTdKqf"
// );

// const TEST_WALLET = new PublicKey(
//   "6U3XNWQdwEjz6nXBNMqk4kx2xNqvmauUgtRFeD9ESzQD"
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

// const api_key = config.solana.apiKey;
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
    const tokenPrice = await getTokenPrice(mint as string);

    if (!data.result) {
      throw new Error("No result in API response");
    }

    return {
      ...data.result,
      tokenPrice: tokenPrice,
    };
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
    console.log("Searching for wallet:", wallet);
    console.log("selectedVault:", selectedVault);
    const accounts = await connection.getProgramAccounts(m3m3_PROGRAM_ID, {
      filters: [
        {
          memcmp: {
            offset: 8,
            bytes: wallet,
          },
        },
      ],
    });

    console.log("Found accounts:", accounts.length);
    const tokenADecimals = await getTokenDecimals(
      new PublicKey(selectedVault.token_a_mint)
    );

    const returnData: WalletData[] = accounts
      .map(({ account }) => {
        const decoded = StakeEscrow.decode(account.data);
        if (decoded.vault.equals(new PublicKey(selectedVault.vault_address))) {
          return {
            wallet_pubkey: wallet,
            vault_pubkey: decoded.vault.toBase58(),
            total_staked_amount: formatTokenAmount(
              Number(decoded.stakeAmount),
              tokenADecimals
            ),
            total_claimed: {
              token_a: formatTokenAmount(
                Number(decoded.feeAClaimedAmount),
                tokenADecimals
              ),
              sol: formatTokenAmount(Number(decoded.feeBClaimedAmount), 9),
            },
          };
        }
        return undefined;
      })
      .filter((data): data is WalletData => data !== undefined);

    return returnData[0];
  } catch (error) {
    console.error("Error fetching staking history:", error);
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
async function getTokenDecimals(mint: PublicKey): Promise<number> {
  const tokenInfo = await connection.getParsedAccountInfo(mint);

  if (tokenInfo.value && tokenInfo.value.data) {
    const data = tokenInfo.value.data as {
      parsed: { info: { decimals: number } };
    };
    if (
      data.parsed &&
      data.parsed.info &&
      typeof data.parsed.info.decimals === "number"
    ) {
      return data.parsed.info.decimals;
    }
  }

  return 9;
}

async function getTokenPrice(mint: string): Promise<number> {
  try {
    const response = await fetch(`https://api.jup.ag/price/v2?ids=${mint}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = await response.json();

    return data[mint].price;
  } catch (error) {
    console.error("Error fetching token price:", error);
    throw error;
  }
}
