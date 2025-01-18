import { PublicKey } from "@solana/web3.js";
import { config } from "@config/config";
import {
  M3M3_VaultData,
  TokenMetadata,
  VaultOptions,
  WalletData,
} from "./types";
import { Connection } from "@solana/web3.js";
import { formatTokenAmount } from "./utils";

const m3m3_PROGRAM_ID = new PublicKey(
  "FEESngU3neckdwib9X3KWqdL7Mjmqk9XNp3uh5JbP4KP"
);
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
    console.log("responseData:", responseData);

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

    if (!data.result) {
      throw new Error("No result in API response");
    }

    return data.result;
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    throw error;
  }
}

export async function getStakingHistory(
  tokenMint: string,
  wallet: string
): Promise<WalletData> {
  try {
    const programAccount = await connection.getProgramAccounts(
      m3m3_PROGRAM_ID,
      {
        filters: [
          {
            memcmp: {
              offset: 8,
              bytes: wallet,
            },
          },
        ],
      }
    );
    console.log("tokenMint:", tokenMint);
    console.log("wallet:", wallet);

    const account = programAccount[0];
    const data = account.account.data;

    const feeAClaimedAmount = data.subarray(120, 128).readBigUInt64LE(0);
    const feeBClaimedAmount = data.subarray(136, 144).readBigUInt64LE(0);

    const tokenADecimals = await getTokenDecimals(new PublicKey(tokenMint));

    //needs clean up <-----------
    return {
      stake_account: account.pubkey.toBase58(),
      wallet_pubkey: new PublicKey(data.subarray(8, 40)).toBase58(),
      vault_pubkey: new PublicKey(data.subarray(40, 72)).toBase58(),
      total_staked_amount: (() => {
        const rawStakeAmount = data.subarray(80, 88).readBigUInt64LE(0);
        console.log("Raw stake amount (BigInt):", rawStakeAmount.toString());
        const formatted = formatTokenAmount(
          Number(rawStakeAmount),
          tokenADecimals
        );
        console.log("Formatted stake amount:", formatted);
        return formatted;
      })(),
      total_claimed: {
        token_a: (() => {
          console.log(
            "Raw fee A claimed (BigInt):",
            feeAClaimedAmount.toString()
          );
          const formatted = formatTokenAmount(
            Number(feeAClaimedAmount),
            tokenADecimals
          );
          console.log("Formatted token A claimed:", formatted);
          return formatted;
        })(),
        sol: (() => {
          console.log(
            "Raw fee B claimed (BigInt):",
            feeBClaimedAmount.toString()
          );
          const formatted = formatTokenAmount(Number(feeBClaimedAmount), 9);
          console.log("Formatted SOL claimed:", formatted);
          return formatted;
        })(),
      },
    };
  } catch (error) {
    console.error("Error fetching staking history:", error);
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
