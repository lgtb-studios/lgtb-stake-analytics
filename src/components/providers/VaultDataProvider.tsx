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
    resetWalletAddress: () => void;
    resetWalletData: () => void;
}
// future implementation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initialState = {
    walletAddress: '',
    tokenData: null,
    selectedVault: null,
    vaultData: null,
    walletStats: null,
    isLoading: false,
};

const VaultDataContext = React.createContext<VaultDataContextType | undefined>(undefined);

interface VaultProviderProps {
    children: ReactNode;
    initialData?: Partial<typeof initialState>;
}

export function VaultProvider({
    children,
    initialData = {}
}: VaultProviderProps) {
    const [tokenData, setTokenData] = useState<TokenMetadata | null>(
        initialData.tokenData ?? null
    );
    const [vaultData, setVaultData] = useState<M3M3_VaultData | null>(
        initialData.vaultData ?? null
    );
    const [selectedVault, setSelectedVault] = useState<VaultSelection | null>(
        initialData.selectedVault ?? null
    );
    const [walletAddress, setWalletAddress] = useState<string>(
        initialData.walletAddress ?? ''
    );
    const [walletStats, setWalletStats] = useState<WalletData | null>(
        initialData.walletStats ?? null
    );
    const [isLoading, setIsLoading] = useState(
        initialData.isLoading ?? false
    );

    const resetWalletData = () => {
        setWalletStats(null);
    };

    const resetWalletAddress = () => {
        setWalletAddress('');
    }

    const contextValue = React.useMemo(() => ({
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
        resetWalletAddress
    }), [
        selectedVault,
        walletAddress,
        walletStats,
        isLoading,
        tokenData,
        vaultData,
    ]);

    return (
        <VaultDataContext.Provider value={contextValue}>
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