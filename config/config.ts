export const config = {
  solana: {
    mainnet: process.env.NEXT_PUBLIC_SOLANA_RPC_URL_MAINNET,
    devnet: process.env.NEXT_PUBLIC_SOLANA_RPC_URL_DEVNET,
    apiKey: process.env.NEXT_PUBLIC_HELIUS_API_KEY,
  },
  api: {
    lgtb_apiKey: process.env.NEXT_PUBLIC_LGTB_API_KEY,
  },
};
