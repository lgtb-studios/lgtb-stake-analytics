'use client'
import { M3M3_VaultData, TokenMetadata } from "@/lib/types";
import { Card, CardContent } from "./ui/card";
import { calculateStakedPercentage, formatNumberWithCommas } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getTokenMetaData } from "@/lib/Web3";

interface VaultStatsProps {
    data: M3M3_VaultData | null;
}

export default function VaultStats(data: VaultStatsProps) {
    const [tokenData, setTokenData] = useState<TokenMetadata | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const fetchVaultInfo = async () => {
            if (!data?.data?.token_a_mint) {
                setError("No token mint address available");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const token = await getTokenMetaData(data.data.token_a_mint);

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
                    setIsLoading(false);
                }
            }
        };
        fetchVaultInfo();

        return () => {
            mounted = false;
        };
    }, [data?.data?.token_a_mint]);

    console.log(tokenData?.token_info);
    return (
        <div>
            <div className="flex  flex-wrap overflow-x-auto gap-2 pb-2 mt-4">
                <Card className="min-w-[130px]shadow-sm">
                    <CardContent className="p-2">
                        <div className="text-[10px]">{data?.data?.token_a_symbol} Rewards USD</div>
                        <div className="text-sm font-semibold">
                            ${formatNumberWithCommas(data?.data?.current_reward_token_a_usd.toFixed(4))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="min-w-[130px] shadow-sm">
                    <CardContent className="p-2">
                        <div className="text-[10px]">{data?.data?.token_b_symbol} Rewards USD</div>
                        <div className="text-sm font-semibold">
                            ${formatNumberWithCommas(data?.data?.current_reward_token_b_usd.toFixed(4))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="min-w-[130px] shadow-sm">
                    <CardContent className="p-2">
                        <div className="text-[10px]">USD Rewards</div>
                        <div className="text-sm font-semibold">
                            ${formatNumberWithCommas(data?.data?.current_reward_usd.toFixed(2).toLocaleString())}
                        </div>
                    </CardContent>
                </Card>

                <Card className="min-w-[130px] shadow-sm">
                    <CardContent className="p-2">
                        <div className="text-[10px]">Daily Rewards</div>
                        <div className="text-sm font-semibold">
                            ${formatNumberWithCommas(data?.data?.daily_reward_usd.toFixed(2).toLocaleString())}
                        </div>
                    </CardContent>
                </Card>

                <Card className="min-w-[130px]shadow-sm">
                    <CardContent className="p-2">
                        <div className="text-[10px]">Market Cap</div>
                        <div className="text-sm font-semibold">
                            ${data?.data?.marketcap.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex  flex-wrap overflow-x-auto gap-2 pb-2 ">
                <Card className="min-w-[130px]shadow-sm">
                    <CardContent className="p-2">
                        <div className="text-[10px]">Total Staked</div>
                        <div className="text-sm font-semibold">
                            {formatNumberWithCommas(data?.data?.total_staked_amount)}
                        </div>
                    </CardContent>
                </Card>
                <Card className="min-w-[130px] shadow-sm">
                    <CardContent className="p-2">
                        <div className="text-[10px]">Total Staked USD</div>
                        <div className="text-sm font-semibold">
                            ${formatNumberWithCommas(data?.data?.total_staked_amount_usd.toFixed(2))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="min-w-[130px] shadow-sm">
                    <CardContent className="p-2">
                        <div className="text-[10px]">Total Staked Percentage</div>
                        <div className="text-sm font-semibold">
                            {calculateStakedPercentage(
                                Number(data?.data?.total_staked_amount),
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