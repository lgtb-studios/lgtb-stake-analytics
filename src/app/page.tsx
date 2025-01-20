'use client'
import VaultStats from "@/components/vault-analytics/VaultStats";
import { AddressForm } from "@/components/AddressForm";
import { useEffect, useState } from "react";
import { getVaults } from "@/lib/Web3";
import { VaultOptions, VaultSelection } from "@/lib/types";
import WalletStats from "@/components/wallet-analytics/WalletStats";
import { useVault } from '@/components/providers/VaultDataProvider';
import { useActivityDetection } from "@/hooks/useActivityDetection";

export default function Home() {
  const {
    selectedVault,
    setSelectedVault,
    walletAddress,
    setWalletAddress,
    resetWalletData,
    resetWalletAddress
  } = useVault();
  const [vaults, setVaults] = useState<VaultOptions[]>([]);
  const isActive = useActivityDetection(120000);

  const handleAddressSubmit = (address: string) => {
    setWalletAddress(address);
  };

  const handleVaultSelect = (vault: VaultSelection) => {
    setSelectedVault(vault);
    resetWalletData();
    resetWalletAddress();
  };

  useEffect(() => {
    const mounted = { current: true };
    let intervalId: NodeJS.Timeout | null = null;

    const fetchVaults = async () => {
      if (!isActive) return;
      try {
        const vaultsData = await getVaults();
        if (mounted.current) {
          setVaults(vaultsData || []);
        }
      } catch (error) {
        console.error('Error fetching vaults:', error);
      }
    };

    if (isActive) {
      fetchVaults();
      intervalId = setInterval(fetchVaults, 5000);
    }

    return () => {
      mounted.current = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive]);

  return (
    <div className="w-full p-4">
      <div className="w-full max-w-full">
        <VaultStats
          vaultOptions={vaults}
          onVaultSelect={handleVaultSelect}
          selectedVault={selectedVault?.vault_address}
        />
      </div>

      {selectedVault && (
        <AddressForm
          onSubmit={handleAddressSubmit}
          label="wallet"
        />
      )}

      {walletAddress && (
        <WalletStats />
      )}
    </div>
  );
}