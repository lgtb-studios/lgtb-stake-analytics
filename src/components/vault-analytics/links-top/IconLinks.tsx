import Image from 'next/image'
import Link from 'next/link'
import { VaultTop50 } from './VaultTop50';
import { Separator } from '@/components/ui/separator';

export const IconLinks = ({
    poolAddress,
    tokenSymbol
}: {
    poolAddress: string | undefined;
    tokenSymbol: string | undefined;
}) => {
    return (
        <div className="flex row gap-2 mt-1 items-center">
            <Link href={`https://m3m3.meteora.ag/farms/${poolAddress}`} target="_blank" rel="noopener noreferrer">
                <Image
                    src='/logo-meteora-symbol-onDark.png'
                    alt='Meteora Logo'
                    width={100}
                    height={100}
                    className="w-6 h-6 rounded-full border-1"
                />
            </Link>

            <Link href={`https://jup.ag/swap/SOL-${tokenSymbol}`} target="_blank" rel="noopener noreferrer">
                <Image
                    src='/jup-logo-bright.svg'
                    alt='Jupiter Logo'
                    width={100}
                    height={100}
                    className="w-6 h-6 rounded-full border-1"
                />
            </Link>
            <Separator orientation="vertical" className='mx-[2px] border h-4' />
            <VaultTop50 />
        </div>
    )
}