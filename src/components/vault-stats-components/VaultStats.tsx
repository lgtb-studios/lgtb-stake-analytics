'use client'
import { M3M3_VaultData, TokenMetadata } from "@/lib/types";
import { Card, CardContent } from "../ui/card";
import { calculateStakedPercentage, formatNumberWithCommas } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getTokenMetaData } from "@/lib/Web3";
import { getVaultInfo } from "@/lib/Web3";
import { AddressForm } from "../AddressForm";

interface VaultStatsProps {
    vaultAddress: string;
    onSubmit: (address: string) => void;
}

export default function VaultStats({ vaultAddress, onSubmit }: VaultStatsProps) {
    const [tokenData, setTokenData] = useState<TokenMetadata | null>(null);
    const [vaultData, setVaultData] = useState<M3M3_VaultData | null>(null);
    const [vaultLoading, setVaultLoading] = useState(true);
    const [tokenLoading, setTokenLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        let mounted = true;
        let intervalId: NodeJS.Timeout;

        const fetchVaultInfo = async () => {
            try {
                if (initialLoad) setVaultLoading(true);
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
                    setVaultLoading(false);
                    if (initialLoad) setInitialLoad(false);
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
    }, [vaultAddress]);

    useEffect(() => {
        let mounted = true;

        const fetchVaultInfo = async () => {
            if (!vaultData?.token_a_mint) {
                setError("No token mint address available");
                setTokenLoading(false);
                return;
            }

            try {
                if (initialLoad) setTokenLoading(true);
                const token = await getTokenMetaData(vaultData.token_a_mint);

                if (mounted) {
                    setTokenData(token);
                    setError(null);
                }
            } catch (error) {
                console.error("Error fetching vault data:", error);
                if (mounted) {
                    setError("Failed to fetch vault data");
                    setTokenData(null);
                }
            } finally {
                if (mounted) {
                    setTokenLoading(false);
                    if (initialLoad) setInitialLoad(false);
                }
            }
        };
        fetchVaultInfo();
        return () => {
            mounted = false;
        };
    }, [vaultData?.token_a_mint]);

    // Now loading state only shows on initial load
    if (initialLoad && (vaultLoading || tokenLoading)) {
        return <div>Loading...</div>;
    }


    console.log(tokenData?.token_info);
    return (
        <div>
            <AddressForm onSubmit={onSubmit} label="vault" />
            <div className="flex  flex-wrap overflow-x-auto gap-2 pb-2 mt-4">
                <Card className="min-w-[130px]shadow-sm">
                    <CardContent className="p-2">
                        <div className="text-[10px]">{vaultData?.token_a_symbol} Rewards USD</div>
                        <div className="text-sm font-semibold">
                            ${formatNumberWithCommas(vaultData?.current_reward_token_a_usd.toFixed(4))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="min-w-[130px] shadow-sm">
                    <CardContent className="p-2">
                        <div className="text-[10px]">{vaultData?.token_b_symbol} Rewards USD</div>
                        <div className="text-sm font-semibold">
                            ${formatNumberWithCommas(vaultData?.current_reward_token_b_usd.toFixed(4))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="min-w-[130px] shadow-sm">
                    <CardContent className="p-2">
                        <div className="text-[10px]">USD Rewards</div>
                        <div className="text-sm font-semibold">
                            ${formatNumberWithCommas(vaultData?.current_reward_usd.toFixed(2).toLocaleString())}
                        </div>
                    </CardContent>
                </Card>

                <Card className="min-w-[130px] shadow-sm">
                    <CardContent className="p-2">
                        <div className="text-[10px]">Daily Rewards</div>
                        <div className="text-sm font-semibold">
                            ${formatNumberWithCommas(vaultData?.daily_reward_usd.toFixed(2).toLocaleString())}
                        </div>
                    </CardContent>
                </Card>

                <Card className="min-w-[130px]shadow-sm">
                    <CardContent className="p-2">
                        <div className="text-[10px]">Market Cap</div>
                        <div className="text-sm font-semibold">
                            ${vaultData?.marketcap.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex  flex-wrap overflow-x-auto gap-2 pb-2 ">
                <Card className="min-w-[130px]shadow-sm">
                    <CardContent className="p-2">
                        <div className="text-[10px]">Total Staked</div>
                        <div className="text-sm font-semibold">
                            {formatNumberWithCommas(vaultData?.total_staked_amount)}
                        </div>
                    </CardContent>
                </Card>
                <Card className="min-w-[130px] shadow-sm">
                    <CardContent className="p-2">
                        <div className="text-[10px]">Total Staked USD</div>
                        <div className="text-sm font-semibold">
                            ${formatNumberWithCommas(vaultData?.total_staked_amount_usd.toFixed(2))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="min-w-[130px] shadow-sm">
                    <CardContent className="p-2">
                        <div className="text-[10px]">Total Staked Percentage</div>
                        <div className="text-sm font-semibold">
                            {calculateStakedPercentage(
                                Number(vaultData?.total_staked_amount),
                                Number(tokenData?.token_info?.supply),
                                tokenData?.token_info?.decimals,
                                2
                            )}%
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

    )
}