interface topList {
  owner: string;
  staked_amount: number;
  token_a_accumulated_reward: number;
  token_b_accumulated_reward: number;
  token_a_accumulated_reward_usd: number;
  token_b_accumulated_reward_usd: number;
  daily_reward_usd: number;
}

export interface M3M3_VaultData {
  vault_address: string;
  pool_address: string;
  token_a_mint: string;
  token_b_mint: string;
  stake_mint: string;
  token_a_symbol: string;
  token_b_symbol: string;
  total_staked_amount: number;
  total_staked_amount_usd: number;
  current_reward_token_a_usd: number;
  current_reward_token_b_usd: number;
  current_reward_usd: number;
  daily_reward_usd: number;
  created_at_slot: number;
  created_at_slot_timestamp: number;
  created_at_tx_sig: string;
  seconds_to_full_unlock: number;
  start_fee_distribute_timestamp: number;
  marketcap: number;
  top_lists: topList[];
}

export type TokenMetadata = {
  id: string;
  content: {
    metadata: {
      name: string;
      symbol: string;
    };
    links: {
      image?: string;
    };
  };
  token_info: {
    price_info?: {
      price_per_token: number;
      currency: string;
    };
    supply: number;
    decimals: number;
  };
};
