'use client'
import VaultStats from "@/components/vault-analytics/VaultStats";
import { AddressForm } from "@/components/AddressForm";
import { useEffect, useState } from "react";
import { getVaults } from "@/lib/Web3";
import { VaultOptions, VaultSelection } from "@/lib/types";
import WalletStats from "@/components/wallet-analytics/WalletStats";

export default function Home() {
  const [vaults, setVaults] = useState<VaultOptions[]>([]);
  const [selectedVault, setSelectedVault] = useState<VaultSelection | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');

  const handleAddressSubmit = async (address: string) => {
    setWalletAddress(address);
  };
  const handleVaultSelect = (address: VaultSelection) => {
    setSelectedVault(address);
    setWalletAddress('');
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

  console.log(selectedVault)

  // useEffect(() => {
  //   if (!walletAddress) return;
  //   const fetchData = async () => {
  //     try {
  //       if (selectedVault?.token_a_mint) {
  //         const walletData = await getStakingHistory(selectedVault.token_a_mint, walletAddress);
  //         setWalletStats(walletData);
  //       }
  //       console.log(walletStats);
  //     } catch (error) {
  //       console.error('Error fetching vaults:', error);
  //     }
  //   };

  //   fetchData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [walletAddress, selectedVault?.token_a_mint]);

  // console.log(walletStats);

  return (
    <div className="w-full p-4">
      <div className="w-full max-w-full">

        {Array.isArray(vaults) ? (
          <VaultStats
            vaultOptions={vaults}
            onVaultSelect={handleVaultSelect}
            selectedVault={selectedVault?.vault_address}
          />
        ) : null}

      </div>
      {selectedVault && <AddressForm onSubmit={handleAddressSubmit} label="wallet" />}
      {walletAddress && (
        <WalletStats
          pubkey={walletAddress}
          selectedVault={selectedVault}
        />
      )}
    </div>
  );
}
