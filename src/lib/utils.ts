import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
