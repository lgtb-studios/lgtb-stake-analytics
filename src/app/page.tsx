'use client'
import { ThemeModeToggle } from "@/components/ThemeModeToggle";
import VaultStats from "@/components/VaultStats";
import { WalletAddressForm } from "@/components/WalletAddressForm";
import { M3M3_VaultData } from "@/lib/types";
import { getVaultInfo } from "@/lib/Web3";
import { useEffect, useState } from "react";
//import { useState } from "react";
//import Image from "next/image";

export default function Home() {
  const vaultAddress = 'ZxuHhk6X1nBP3A7vLPYrUSugsbxtCAqk5sm3W7eGFNk';
  const [vaultData, setVaultData] = useState<M3M3_VaultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchVaultInfo = async () => {
      try {
        setIsLoading(true);
        const vault = await getVaultInfo(vaultAddress);
        if (mounted) {
          setVaultData(vault);
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching vault data:", error);
        if (mounted) {
          setError("Failed to fetch vault data");
          setVaultData(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    fetchVaultInfo();

    return () => {
      mounted = false;
    };
  }, [vaultAddress]);

  console.log(vaultData);

  //work on later
  const handleAddressSubmit = async (address: string) => {

    console.log(address);
  };

  return (
    <div className="w-full p-4">
      <ThemeModeToggle />
      <div className="w-full max-w-full">
        <VaultStats data={vaultData} />
      </div>
      <WalletAddressForm onSubmit={handleAddressSubmit} />
    </div>
  );
}
