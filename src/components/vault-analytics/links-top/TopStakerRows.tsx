import { Card, CardContent } from '@/components/ui/card';
import { topList } from '../../../lib/types';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { formatNumberWithCommas } from '@/lib/utils';
import Link from 'next/link';

export function TopStakerRows({ staker }: { staker: topList }) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
        return (
            <Link href={`https://solscan.io/account/${staker.owner}`} target="_blank" rel="noopener noreferrer">
                <Card className="bg-muted/50 w-full mb-2 hover:bg-muted/70 transition-colors">
                    <CardContent className='p-4'>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col">
                                    <p className="text-sm font-medium text-muted-foreground">Wallet</p>
                                    <p className="text-sm font-semibold">
                                        {staker.owner}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="text-sm font-medium text-muted-foreground">Staked Amount</p>
                                <p className="text-sm font-semibold">
                                    {formatNumberWithCommas(staker.staked_amount)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        )
    }

    return (
        <Card className="bg-muted/50 w-full mb-2 hover:bg-muted/70 transition-colors">
            <CardContent className='p-3'>
                <div className="flex flex-col space-y-2">
                    <div className="flex flex-col">
                        <p className="text-xs font-medium text-muted-foreground">Wallet</p>
                        <p className="text-xs font-semibold truncate max-w-[200px]">
                            {staker.owner}
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-xs font-medium text-muted-foreground">Staked</p>
                        <p className="text-xs font-semibold">
                            {formatNumberWithCommas(staker.staked_amount)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}