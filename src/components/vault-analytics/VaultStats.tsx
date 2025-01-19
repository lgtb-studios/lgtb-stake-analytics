'use client'
import { M3M3_VaultData, TokenMetadata, VaultOptions, VaultSelection } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { calculateStakedPercentage, formatNumberWithCommas } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getTokenMetaData } from "@/lib/Web3";
import { getVaultInfo } from "@/lib/Web3";

import { Selector } from "./Selector";
import { StatsCard } from "../StatsCard";
import Image from "next/image";
import { IconLinks } from "./IconLinks";


interface VaultStatsProps {
    vaultOptions: VaultOptions[];
    onVaultSelect: (address: VaultSelection) => void;
    selectedVault: string | undefined
}

export default function VaultStats({ vaultOptions, onVaultSelect, selectedVault }: VaultStatsProps) {
    const [tokenData, setTokenData] = useState<TokenMetadata | null>(null);
    const [vaultData, setVaultData] = useState<M3M3_VaultData | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        if (!selectedVault) return;

        let mounted = true;
        let intervalId: NodeJS.Timeout;

        const fetchVaultInfo = async () => {
            try {
                const vault = await getVaultInfo(selectedVault);
                if (mounted) {
                    setVaultData(vault);
                }
            } catch (error) {
                console.error("Error fetching vault data:", error);
                if (mounted) {
                    setVaultData(null);
                }
            } finally {
                if (mounted) {
                    if (isInitialLoad) setIsInitialLoad(false);
                }
            }
        };

        fetchVaultInfo();
        // eslint-disable-next-line prefer-const
        intervalId = setInterval(fetchVaultInfo, 10000);

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
                const token = await getTokenMetaData(vaultData.token_a_mint);
                if (mounted) {
                    setTokenData(token);
                }
            } catch (error) {
                console.error("Error fetching token data:", error);
                if (mounted) {
                    setTokenData(null);
                }
            } finally {
                if (mounted) {
                    if (isInitialLoad) setIsInitialLoad(false);
                }
            }
        };

        fetchTokenInfo();

        return () => {
            mounted = false;
        };
    }, [isInitialLoad, vaultData?.token_a_mint]);

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
            <Selector
                options={vaultOptions}
                placeholder="Select an option"
                onSelect={onVaultSelect}
            />
            {selectedVault && (isInitialLoad ? (
                <div>Loading...</div>
            ) : (
                <div className="space-y-2 mt-2">
                    <Card>
                        <CardContent className="p-2 relative">
                            <div className="flex justify-between">
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
                                        <IconLinks poolAddress={vaultData?.pool_address} tokenSymbol={vaultData?.token_a_symbol} />
                                    </div>
                                </div>
                                {vaultData?.token_a_symbol.includes('LGTB') && (
                                    <Image
                                        src='/lgtb-meme.png'
                                        alt='LGTB Meme'
                                        width={140}
                                        height={140}
                                        className="absolute right-0 top-1"
                                    />)}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
                                {tokenStats.map((stat, index) => (
                                    <StatsCard key={index} label={stat.label} value={stat.value} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="p-2">
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

                    <Card>
                        <CardContent className="p-2">
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