'use client'
import { M3M3_VaultData, TokenMetadata, VaultOptions } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { calculateStakedPercentage, formatNumberWithCommas } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getTokenMetaData } from "@/lib/Web3";
import { getVaultInfo } from "@/lib/Web3";

import { SearchableSelector } from "./SearchableSelector";
import { StatsCard } from "./StatsCard";
import Image from "next/image";


interface VaultStatsProps {
    vaultOptions: VaultOptions[];
    onVaultSelect: (address: string) => void;
    selectedVault: string | null;
}

export default function VaultStats({ vaultOptions, onVaultSelect, selectedVault }: VaultStatsProps) {
    const [tokenData, setTokenData] = useState<TokenMetadata | null>(null);
    const [vaultData, setVaultData] = useState<M3M3_VaultData | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [vaultLoading, setVaultLoading] = useState(true);
    const [tokenLoading, setTokenLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedVault) return;

        let mounted = true;
        let intervalId: NodeJS.Timeout;

        const fetchVaultInfo = async () => {
            try {
                if (isInitialLoad) setVaultLoading(true);
                const vault = await getVaultInfo(selectedVault);
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
                    setVaultLoading(false);
                    if (isInitialLoad) setIsInitialLoad(false);
                }
            }
        };

        fetchVaultInfo();
        // eslint-disable-next-line prefer-const
        intervalId = setInterval(fetchVaultInfo, 15000);

        return () => {
            mounted = false;
            clearInterval(intervalId);
        };
    }, [isInitialLoad, selectedVault]);

    useEffect(() => {
        if (!vaultData?.token_a_mint) return;

        let mounted = true;

        const fetchTokenInfo = async () => {
            try {
                if (isInitialLoad) setTokenLoading(true);
                const token = await getTokenMetaData(vaultData.token_a_mint);
                if (mounted) {
                    setTokenData(token);
                    setError(null);
                }
            } catch (error) {
                console.error("Error fetching token data:", error);
                if (mounted) {
                    setError("Failed to fetch token data");
                    setTokenData(null);
                }
            } finally {
                if (mounted) {
                    setTokenLoading(false);
                    if (isInitialLoad) setIsInitialLoad(false);
                }
            }
        };

        fetchTokenInfo();

        return () => {
            mounted = false;
        };
    }, [vaultData?.token_a_mint]);

    const vaultRewardsStats = [
        {
            label: `${vaultData?.token_a_symbol} Rewards USD`,
            value: `$${formatNumberWithCommas(vaultData?.current_reward_token_a_usd.toFixed(4))}`,
        },
        {
            label: `${vaultData?.token_b_symbol} Rewards USD`,
            value: `$${formatNumberWithCommas(vaultData?.current_reward_token_b_usd.toFixed(4))}`,
        },
        {
            label: `Total USD Rewards`,
            value: `$${formatNumberWithCommas(vaultData?.current_reward_usd.toFixed(2))}`,
        },
        {
            label: `Daily Rewards`,
            value: `$${formatNumberWithCommas(vaultData?.daily_reward_usd.toFixed(2))}`,
        },

    ];
    const tokenStats = [
        {
            label: `${vaultData?.token_a_symbol} USD Price`,
            value: `$${tokenData?.token_info?.price_info?.price_per_token.toFixed(7)}`,
        },
        {
            label: `Market Cap`,
            value: `$${formatNumberWithCommas(vaultData?.marketcap)}`,
        },
    ]

    const vaultTokenStats = [
        {
            label: `Total Staked`,
            value: `${formatNumberWithCommas(vaultData?.total_staked_amount)}`,
        },
        {
            label: `Total Staked USD`,
            value: `$${formatNumberWithCommas(vaultData?.total_staked_amount_usd.toFixed(2))}`,
        },
        {
            label: `Total Staked Percentage`,
            value: `${calculateStakedPercentage(
                Number(vaultData?.total_staked_amount),
                Number(tokenData?.token_info?.supply),
                tokenData?.token_info?.decimals,
                2)}%`,
        },
    ]


    return (
        <div>
            <SearchableSelector
                options={vaultOptions}
                placeholder="Select an option"
                onSelect={onVaultSelect}
            />
            {selectedVault && (isInitialLoad ? (
                <div>Loading...</div>
            ) : (
                <div className="space-y-4 mt-4">
                    {/* Header Card */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <Image
                                    src={tokenData?.content.links.image || '/default-image.png'}
                                    alt={tokenData?.content.metadata.name || 'Default Alt Text'}
                                    width={100}
                                    height={100}
                                    className="w-16 h-16 rounded-full"
                                />
                                <div>
                                    <CardTitle className="text-lg">
                                        {tokenData?.content.metadata.name}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">Token Analytics</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
                                {tokenStats.map((stat, index) => (
                                    <StatsCard key={index} label={stat.label} value={stat.value} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vault Stats */}
                    <Card>
                        <CardHeader className="p-4">
                            <CardTitle className="text-lg">Vault Metrics</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                                {vaultTokenStats.map((stat, index) => (
                                    <StatsCard key={index} label={stat.label} value={stat.value} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Rewards Stats */}
                    <Card>
                        <CardHeader className="p-4">
                            <CardTitle className="text-lg">Reward Analytics</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                                {vaultRewardsStats.map((stat, index) => (
                                    <StatsCard key={index} label={stat.label} value={stat.value} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            ))}
        </div>

    )
}