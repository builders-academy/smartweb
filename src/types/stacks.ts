import { StacksNetwork } from "@stacks/network";

export interface UserData {
  profile: {
    stxAddress: {
      mainnet: string;
      testnet: string;
    };
  };
}

export interface AppConfig {
  appName: string;
  appIconUrl: string;
  network: StacksNetwork;
}

export interface Asset {
  asset_id: string;
  amount: string;
  name: string;
  symbol: string;
}

export interface BalanceData {
  stx: {
    balance: string;
    total_sent: string;
    total_received: string;
    total_fees_sent: string;
    total_miner_rewards_received: string;
  };
}
