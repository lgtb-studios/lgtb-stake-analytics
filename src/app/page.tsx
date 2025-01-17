'use client'
import { ThemeModeToggle } from "@/components/ThemeModeToggle";
import VaultStats from "@/components/vault-stats-components/VaultStats";
import { AddressForm } from "@/components/AddressForm";
import { useState } from "react";
//import Image from "next/image";

export default function Home() {
  //const lgtbVaultAddress = 'ZxuHhk6X1nBP3A7vLPYrUSugsbxtCAqk5sm3W7eGFNk';
  const [vaultAddress, setVaultAddress] = useState<string>('');
  // const [walletAddress, setWalletAddress] = useState<string>('');

  //work on later
  // const handleAddressSubmit = async (address: string) => {

  //   console.log(address);
  // };

  const handleVaultAddressSubmit = async (address: string) => {
    setVaultAddress(address);
  };

  return (
    <div className="w-full p-4">
      <ThemeModeToggle />
      <div className="w-full max-w-full">

        {vaultAddress ? <VaultStats vaultAddress={vaultAddress} onSubmit={handleVaultAddressSubmit} />
          : <AddressForm onSubmit={handleVaultAddressSubmit} label="vault" />}
      </div>
      {/* <AddressForm onSubmit={handleAddressSubmit} label="wallet" /> */}
    </div>
  );
}
