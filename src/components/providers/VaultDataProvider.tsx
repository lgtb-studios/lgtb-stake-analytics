'use client'

import { M3M3_VaultData, TokenMetadata, VaultSelection, WalletData } from "@/lib/types";
import React, { ReactNode, useContext, useState } from "react";

interface VaultDataContextType {
    walletAddress: string;
    setWalletAddress: (address: string) => void;
    tokenData: TokenMetadata | null;
    setTokenData: (data: TokenMetadata | null) => void;
    selectedVault: VaultSelection | null;
    setSelectedVault: (vault: VaultSelection | null) => void;
    vaultData: M3M3_VaultData | null;
    setVaultData: (data: M3M3_VaultData | null) => void;
    walletStats: WalletData | null;
    setWalletStats: (stats: WalletData | null) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    resetWalletData: () => void;
}

const VaultDataContext = React.createContext<VaultDataContextType | undefined>(undefined);

export function VaultProvider({ children }: { children: ReactNode }) {
    const [tokenData, setTokenData] = useState<TokenMetadata | null>(null);
    const [vaultData, setVaultData] = useState<M3M3_VaultData | null>(null);
    const [selectedVault, setSelectedVault] = useState<VaultSelection | null>(null);
    const [walletAddress, setWalletAddress] = useState<string>('');
    const [walletStats, setWalletStats] = useState<WalletData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const resetWalletData = () => {
        setWalletAddress('');
        setWalletStats(null);
    };

    return (
        <VaultDataContext.Provider
            value={{
                selectedVault,
                walletAddress,
                walletStats,
                isLoading,
                tokenData,
                setTokenData,
                vaultData,
                setVaultData,
                setSelectedVault,
                setWalletAddress,
                setWalletStats,
                setIsLoading,
                resetWalletData,
            }}
        >
            {children}
        </VaultDataContext.Provider>
    );
}
export function useVault() {
    const context = useContext(VaultDataContext);
    if (context === undefined) {
        throw new Error('useVault must be used within a VaultProvider');
    }
    return context;
}
