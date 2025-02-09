'use client'
import VaultStats from "@/components/vault-analytics/VaultStats";
//import { AddressForm } from "@/components/AddressForm";
import { useEffect, useState } from "react";
import { getVaults } from "@/lib/Web3";
import { VaultOptions, VaultSelection } from "@/lib/types";
import WalletStats from "@/components/wallet-analytics/WalletStats";
import { useVault } from '@/components/providers/VaultDataProvider';

export default function Home() {
  const {
    selectedVault,
    setSelectedVault,
    walletAddress,
    resetWalletData,
    resetWalletAddress
  } = useVault();
  const [vaults, setVaults] = useState<VaultOptions[]>([]);

  // const handleAddressSubmit = (address: string) => {
  //   setWalletAddress(address);
  // };

  const handleVaultSelect = (vault: VaultSelection) => {
    setSelectedVault(vault);
    resetWalletData();
    resetWalletAddress();
  };

  useEffect(() => {
    const fetchVaults = async () => {
      try {
        const vaultsData = await getVaults();
        setVaults(vaultsData || []);
      } catch (error) {
        console.error('Error fetching vaults:', error);
      }
    };

    fetchVaults();
  }, []);

  return (
    <div className="w-full p-4">

      <div className="w-full max-w-full">
        <VaultStats
          vaultOptions={vaults}
          onVaultSelect={handleVaultSelect}
          selectedVault={selectedVault?.vault_address}
        />
      </div>

      {/* {selectedVault && (
        <AddressForm
          onSubmit={handleAddressSubmit}
          label="wallet"
        />
      )} */}

      {walletAddress && (
        <WalletStats />
      )}
    </div>
  );
}