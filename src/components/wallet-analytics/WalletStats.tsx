'use client'
import { VaultSelection, WalletData } from "@/lib/types";
import { Card, CardContent, CardTitle } from "../ui/card"
import { useEffect, useState } from "react";
import { getStakingHistory } from "@/lib/Web3";
import { CopyableSpan } from "../CopyClipboard";
import { StatsCard } from "../StatsCard";
interface WalletStatsProps {
    pubkey: string;
    selectedVault: VaultSelection | null;
}

export default function WalletStats({ pubkey, selectedVault }: WalletStatsProps) {
    const [walletStats, setWalletStats] = useState<WalletData | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                if (selectedVault?.token_a_mint) {
                    const walletData = await getStakingHistory(
                        selectedVault.token_a_mint,
                        pubkey
                    );
                    setWalletStats(walletData);
                    console.log(walletData);
                }
            } catch (error) {
                console.error('Error fetching wallet stats:', error);
            }
        };

        fetchData();
    }, [pubkey, selectedVault?.token_a_mint]);

    const stakedData = [
        {
            label: 'Total Staked',
            value: walletStats?.total_staked_amount
        },
        {
            label: 'Total Claimed',
            value: walletStats?.total_claimed?.token_a
        },
        {
            label: 'Total SOL Claimed',
            value: walletStats?.total_claimed?.sol
        }
    ];

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
                        <Card className="bg-muted/50">
                            <CardContent className="p-2">
                                <div className="text-xs text-muted-foreground">Vault Account</div>
                                <div className="text-[10px] font-semibold mt-1 break-all">
                                    <CopyableSpan
                                        value={walletStats?.vault_pubkey ?? ''}
                                        className="text-xs sm:text-sm font-mono break-all"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-muted/50">
                            <CardContent className="p-2">
                                <div className="text-xs text-muted-foreground">Stake Account</div>
                                <div className="text-[10px] font-semibold mt-1 break-all">
                                    <CopyableSpan
                                        value={walletStats?.stake_account ?? ''}
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {stakedData.map((data, index) => (
                            <StatsCard key={index} label={data.label} value={data.value} />
                        ))}
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}