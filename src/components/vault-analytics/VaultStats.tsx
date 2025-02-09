'use client'
import { VaultOptions, VaultSelection } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { calculateStakedPercentage, formatNumberWithCommas } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getVaultInfo } from "@/lib/Web3";
import { Selector } from "./Selector";
import { StatsCard } from "../StatsCard";
import Image from "next/image";
import { IconLinks } from "./links-top/IconLinks";
import { useVault } from "../providers/VaultDataProvider";
import { HeadPriceDisplay } from "../HeadPriceDisplay";
import { useActivityDetection } from "@/hooks/useActivityDetection";
import { PercentChart } from "../charts/PercentChart";
import { ImageSkeleton } from "../skeletons/ImageSkeleton";
import { useFetchTokenMetadataAndPrice } from "@/hooks/fetchers";
import { AddressForm } from "../AddressForm";

interface VaultStatsProps {
    vaultOptions: VaultOptions[] | undefined;
    onVaultSelect: (vault: VaultSelection) => void;
    selectedVault?: string;
}
export default function VaultStats({
    vaultOptions,
    onVaultSelect,
    selectedVault,
}: VaultStatsProps) {
    const { tokenData, setTokenData, vaultData, setVaultData, setWalletAddress } = useVault();
    const [previousValue, setPreviousValue] = useState<number | null>(null);
    const { data, isLoading } = useFetchTokenMetadataAndPrice(vaultData?.token_a_mint || '');
    const [lastCheckedPrice, setLastCheckedPrice] = useState<number | null>(null);
    const isActive = useActivityDetection(120000);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const handleAddressSubmit = (address: string) => {
        setWalletAddress(address);
    };

    useEffect(() => {
        if (!selectedVault) return;
        let mounted = true;
        let intervalId: NodeJS.Timeout | null = null;

        const fetchVaultInfo = async () => {
            if (!isActive) return;
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
                if (mounted && isInitialLoad) {
                    setIsInitialLoad(false);
                }
            }
        };

        if (isActive) {
            fetchVaultInfo();
            intervalId = setInterval(fetchVaultInfo, 10000);
        }

        return () => {
            mounted = false;
            if (intervalId) clearInterval(intervalId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInitialLoad, selectedVault, isActive]);

    useEffect(() => {
        if (!data) {
            setTokenData(null);
            return;
        }
        if (JSON.stringify(data) !== JSON.stringify(tokenData)) {
            setTokenData(data);
        }
    }, [data, setTokenData, tokenData]);

    useEffect(() => {
        if (tokenData?.tokenPrice) {
            const currentPrice = Number(tokenData.tokenPrice);
            if (lastCheckedPrice !== null && currentPrice !== lastCheckedPrice) {
                setPreviousValue(lastCheckedPrice);
            }
            setLastCheckedPrice(currentPrice);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenData?.tokenPrice]);

    const tokenRewardStats = [
        {
            label: `${vaultData?.token_a_symbol} Rewards USD`,
            value: `$${formatNumberWithCommas(vaultData?.current_reward_token_a_usd.toFixed(4))}`,
        },
        {
            label: `${vaultData?.token_b_symbol} Rewards USD`,
            value: `$${formatNumberWithCommas(vaultData?.current_reward_token_b_usd.toFixed(4))}`,
        },
    ]

    const vaultRewardsStats = [
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
            value: `$${tokenData?.tokenPrice}`,
        },
        {
            label: `Market Cap`,
            value: `$${formatNumberWithCommas(
                tokenData?.token_info?.supply && tokenData?.tokenPrice && tokenData?.token_info?.decimals
                    ? (Number(tokenData.token_info.supply) / Math.pow(10, tokenData.token_info.decimals)) * tokenData.tokenPrice
                    : 0
            )}`,
        }
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
    ]


    return (
        <div>
            <div className="flex row gap-1 justify-end">
                <HeadPriceDisplay />
                <Selector
                    options={vaultOptions}
                    placeholder="Select an option"
                    onSelect={onVaultSelect}
                    isLoading={isLoading}
                />
            </div>
            {selectedVault && (
                <AddressForm
                    onSubmit={handleAddressSubmit}
                    label="wallet"
                />
            )}

            {selectedVault && (isInitialLoad || isLoading ? (
                <div>Loading...</div>
            ) : (
                <div className="space-y-2 mt-2">
                    <Card>
                        <CardContent className="p-2 relative">
                            <div className="flex justify-between">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    {!tokenData?.content.links.image
                                        ? <ImageSkeleton style="w-16 h-16 rounded-full animate-pulse text-primary" />
                                        : <Image
                                            key={tokenData?.content.links.image}
                                            src={tokenData?.content.links.image || '/default-image.png'}
                                            alt={tokenData?.content.metadata.name || 'Default Alt Text'}
                                            width={100}
                                            height={100}
                                            className="w-16 h-16 rounded-full"
                                        />
                                    }

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
                                {isLoading ? (
                                    // Show skeleton loaders for stats
                                    <div>Loading stats...</div>
                                ) : (
                                    tokenStats.map((stat, index) => (
                                        <StatsCard
                                            key={index}
                                            label={stat.label}
                                            value={stat.value}
                                            currentPrice={Number(tokenData?.tokenPrice)}
                                            previousValue={previousValue}
                                        />
                                    ))
                                )}
                            </div>
                            {/* <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
                                {tokenStats.map((stat, index) => (
                                    <StatsCard key={index} label={stat.label} value={stat.value} currentPrice={Number(tokenData?.tokenPrice)} previousValue={previousValue} />
                                ))}
                            </div> */}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="p-2">
                            <CardTitle className="text-lg">Vault Metrics</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 space-y-2">
                            <div className="flex flex-col lg:flex-row gap-2">
                                <div>
                                    <PercentChart
                                        label="Staked"
                                        value={Number(calculateStakedPercentage(
                                            Number(vaultData?.total_staked_amount),
                                            Number(tokenData?.token_info?.supply),
                                            tokenData?.token_info?.decimals,
                                            2
                                        ))}
                                    />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                    {vaultTokenStats.map((stat, index) => (
                                        <StatsCard
                                            key={index}
                                            label={stat.label}
                                            value={stat.value}
                                        />
                                    ))}
                                    {tokenRewardStats.map((stat, index) => (
                                        <StatsCard
                                            key={index}
                                            label={stat.label}
                                            value={stat.value}
                                        />
                                    ))}
                                    {vaultRewardsStats.map((stat, index) => (
                                        <StatsCard
                                            key={index}
                                            label={stat.label}
                                            value={stat.value}
                                        />
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

            ))}
        </div>

    )
}