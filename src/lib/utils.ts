import { PublicKey } from "@solana/web3.js";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const m3m3_PROGRAM_ID = new PublicKey(
  "FEESngU3neckdwib9X3KWqdL7Mjmqk9XNp3uh5JbP4KP"
);
export const LGTB_TOKEN_MINT_ADDRESS = new PublicKey(
  "2vFYpCh2yJhHphft1Z4XHdafEhj6XksyhFyH9tvTdKqf"
);
export const LGTB_VAULT_ADDRESS = new PublicKey(
  "ZxuHhk6X1nBP3A7vLPYrUSugsbxtCAqk5sm3W7eGFNk"
);

export const DYNAMIC_AMM_PROGRAM_ID = new PublicKey(
  "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB"
);

export const DYNAMIC_VAULT_PROGRAM_ID = new PublicKey(
  "24Uqj9JCLxUeoC3hGfh5W3s9FM9uCHDS2SG3LYwBpyTi"
);

export const METEORA_STAKING_PROGRAM_ID = new PublicKey(
  "STK9HV9eCirYp3PSGwqGzuoEH7UBVkuLjQxmRt7yUT7"
);

export const LGTB_POOL_ADDRESS = new PublicKey(
  "HkkjwRtgtqepZd2uEZcmBoWK7JkxBVWCfXpq1GzLoToT"
);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumberWithCommas = (
  value: number | string | undefined
): string => {
  if (!value) return "0";
  const number = typeof value === "string" ? parseFloat(value) : value;

  return number.toLocaleString("en-US");
};

export const calculateStakedPercentage = (
  stakedAmount: number | string | undefined,
  totalSupply: number | string | undefined,
  tokenDecimals: number | undefined,
  displayDecimals: number
): string => {
  const staked =
    typeof stakedAmount === "string" ? Number(stakedAmount) : stakedAmount;
  const total =
    typeof totalSupply === "string" ? Number(totalSupply) : totalSupply;

  const decimals = tokenDecimals ?? 0;
  const adjustedTotal = total ? total / Math.pow(10, decimals) : 0;

  if (!adjustedTotal || !staked || adjustedTotal === 0) {
    return "0";
  }

  const percentage = (staked / adjustedTotal) * 100;

  return percentage.toFixed(displayDecimals);
};
