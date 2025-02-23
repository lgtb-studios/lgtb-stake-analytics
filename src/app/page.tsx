"use client";
import VaultStats from "@/components/vault-analytics/VaultStats";
import WalletStats from "@/components/wallet-analytics/WalletStats";
import { useVault } from "@/components/providers/VaultDataProvider";

export default function Home() {
  const { walletAddress } = useVault();

  return (
    <div className="w-full p-4">
      <div className="w-full max-w-full">
        <VaultStats />
      </div>

      {walletAddress && <WalletStats />}
    </div>
  );
}
