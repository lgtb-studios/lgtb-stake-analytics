import { PublicKey } from "@solana/web3.js";

const m3m3_PROGRAM_ID = new PublicKey(
  "FEESngU3neckdwib9X3KWqdL7Mjmqk9XNp3uh5JbP4KP"
);
const LGTB_TOKEN_MINT_ADDRESS = new PublicKey(
  "2vFYpCh2yJhHphft1Z4XHdafEhj6XksyhFyH9tvTdKqf"
);

const DYNAMIC_AMM_PROGRAM_ID = new PublicKey(
  "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB"
);

const DYNAMIC_VAULT_PROGRAM_ID = new PublicKey(
  "24Uqj9JCLxUeoC3hGfh5W3s9FM9uCHDS2SG3LYwBpyTi"
);

const METEORA_STAKING_PROGRAM_ID = new PublicKey(
  "STK9HV9eCirYp3PSGwqGzuoEH7UBVkuLjQxmRt7yUT7"
);

const LGTB_POOL_ADDRESS = new PublicKey(
  "HkkjwRtgtqepZd2uEZcmBoWK7JkxBVWCfXpq1GzLoToT"
);

export function getVaultAddress() {
  const [vaultAddress] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), LGTB_TOKEN_MINT_ADDRESS.toBuffer()],
    DYNAMIC_VAULT_PROGRAM_ID
  );

  return vaultAddress;
}

export function getStakingVaultAddress() {
  const [vaultAddress] = PublicKey.findProgramAddressSync(
    [Buffer.from("staking_vault"), LGTB_TOKEN_MINT_ADDRESS.toBuffer()],
    METEORA_STAKING_PROGRAM_ID
  );

  return vaultAddress;
}

export function deriveFeeVault() {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), LGTB_POOL_ADDRESS.toBytes()],
    METEORA_STAKING_PROGRAM_ID
  )[0];
}
