'use client'
import VaultStats from "@/components/vault-stats-components/VaultStats";
// import { AddressForm } from "@/components/AddressForm";
import { useEffect, useState } from "react";
import { getVaults } from "@/lib/Web3";
import { VaultOptions } from "@/lib/types";
//import Image from "next/image";

export default function Home() {
  const [vaults, setVaults] = useState<VaultOptions[]>([]);
  const [selectedVault, setSelectedVault] = useState<string | null>(null);
  // const [walletAddress, setWalletAddress] = useState<string>('');

  //work on later
  // const handleAddressSubmit = async (address: string) => {

  //   console.log(address);
  // };
  const handleVaultSelect = (address: string) => {
    setSelectedVault(address);
    // Do anything else you need with the selected address here
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
  // console.log(vaults);

  return (
    <div className="w-full p-4">
      <div className="w-full max-w-full">

        {Array.isArray(vaults) ? ( // Only render if vaults is an array
          <VaultStats
            vaultOptions={vaults}
            onVaultSelect={handleVaultSelect}
            selectedVault={selectedVault}
          />
        ) : null}

      </div>
      {/* <AddressForm onSubmit={handleAddressSubmit} label="wallet" /> */}
    </div>
  );
}
