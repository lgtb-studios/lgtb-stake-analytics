'use client'
import { Card, CardContent, CardTitle } from "../ui/card"
import { useEffect } from "react";
import { getEscrowAccont } from "@/lib/Web3";
import { CopyableSpan } from "../CopyClipboard";
import { StatsCard } from "../StatsCard";
import { Skeleton } from "../ui/skeleton";
import { useVault } from "../providers/VaultDataProvider";
import { calculateStakedValue, formatNumberWithCommas } from "@/lib/utils";

export default function WalletStats() {
    const {
        tokenData,
        walletAddress,
        selectedVault,
        walletStats,
        setWalletStats,
        isLoading,
        setIsLoading
    } = useVault();

    useEffect(() => {
        const fetchData = async () => {
            setWalletStats(null);
            setIsLoading(true);

            await new Promise(resolve => setTimeout(resolve, 500));

            try {
                if (selectedVault?.token_a_mint && walletAddress) {
                    const walletData = await getEscrowAccont(
                        walletAddress,
                        selectedVault
                    );
                    setWalletStats(walletData);
                }
            } catch (error) {
                console.error('Error fetching wallet stats:', error);
                setWalletStats(null);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletAddress, selectedVault?.token_a_mint, setWalletStats, setIsLoading]);

    const stakedData = [
        {
            label: 'Total Staked',
            value: walletStats?.total_staked_amount
        },
        {
            label: `Total Staked Value`,
            value: `$${formatNumberWithCommas(calculateStakedValue(walletStats?.total_staked_amount, tokenData?.tokenPrice))}`
        },
        {
            label: `Total ${tokenData?.content.metadata.symbol} Claimed`,
            value: walletStats?.total_claimed?.token_a
        },
        {
            label: 'Total SOL Claimed',
            value: walletStats?.total_claimed?.sol
        }
    ];

    if (isLoading) {
        return (
            <div className="space-y-2 mt-2">
                <Card>
                    <CardContent className="p-2 relative">
                        <div>
                            <CardTitle className="text-lg">
                                Wallet Stake Account
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">Analytics</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                            {[1].map((i) => (
                                <Card key={i} className="bg-muted/50">
                                    <CardContent className="p-2">
                                        <div className="text-xs text-muted-foreground">
                                            Stake Account
                                        </div>
                                        <Skeleton className="h-4 w-full mt-1" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-2">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                            {stakedData.map((data, index) => (
                                <StatsCard
                                    key={index}
                                    label={data.label}
                                    value=""
                                    isLoading={true}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!walletStats) {
        return (
            <div>
                No staking data found for this wallet.
            </div>
        )
    }


    return (
        <div className="space-y-2 mt-2">
            <Card>
                <CardContent className="p-2 relative">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                        <Card className="bg-muted/50">
                            <CardContent className="p-2">
                                <div className="text-xs text-muted-foreground">Vault Account</div>
                                <div className="text-[10px] font-semibold mt-1 break-all">
                                    <CopyableSpan
                                        value={walletStats.vault_pubkey}
                                        className="text-xs sm:text-sm font-mono break-all"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-2">
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2">
                        {stakedData.map((data, index) => (
                            <StatsCard
                                key={index}
                                label={data.label}
                                value={data.value}
                                isLoading={false}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}