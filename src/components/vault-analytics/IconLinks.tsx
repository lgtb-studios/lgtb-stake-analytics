import Image from 'next/image'
import Link from 'next/link'

export const IconLinks = ({
    poolAddress,
    tokenSymbol
}: {
    poolAddress: string | undefined;
    tokenSymbol: string | undefined;
}) => {
    return (
        <div className="flex row gap-2 mt-1">
            <Link href={`https://m3m3.meteora.ag/farms/${poolAddress}`} target="_blank" rel="noopener noreferrer">
                <Image
                    src='/logo-meteora-symbol-onDark.png'
                    alt='Meteora Logo'
                    width={100}
                    height={100}
                    className="w-5 h-5 rounded-full border border-white"
                />
            </Link>
            <Link href={`https://jup.ag/swap/SOL-${tokenSymbol}`} target="_blank" rel="noopener noreferrer">
                <Image
                    src='/jup-logo-bright.svg'
                    alt='Jupiter Logo'
                    width={100}
                    height={100}
                    className="w-5 h-5 rounded-full border border-white"
                />
            </Link>
        </div>
    )
}