'use client'
import { HeadPrices } from "@/lib/types";
import Image from "next/image";
import { Card } from "../ui/card";
import { useEffect, useState } from "react";

function getPriceChangeColor(currentPrice: string, previousPrice: string) {
    if (!previousPrice) return '';
    if (currentPrice > previousPrice) return 'text-green-500';
    if (currentPrice < previousPrice) return 'text-red-500';
    return '';
}

export function HeadPriceDisplay({ prices }: { prices: HeadPrices[] }) {

    const [previousPrices, setPreviousPrices] = useState<{ [key: string]: string }>({});

    const sortedPrices = prices?.sort((a, b) => {
        if (a.key.includes('So1')) return -1;
        if (b.key.includes('So1')) return 1;
        return 0;
    });

    useEffect(() => {
        if (sortedPrices?.length) {
            setPreviousPrices(prev => ({
                sol: prev.sol || sortedPrices[0]?.price.toString(),
                jup: prev.jup || sortedPrices[1]?.price.toString()
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (sortedPrices?.length) {
            setTimeout(() => {
                setPreviousPrices({
                    sol: sortedPrices[0]?.price,
                    jup: sortedPrices[1]?.price,
                });
            }, 1000);
        }
    }, [sortedPrices]);

    return (
        <div className="flex items-center gap-1">
            <Card className="flex items-center justify-center gap-1 px-2 h-9 rounded-sm">
                <Image
                    src="/solanaLogoMark.svg"
                    alt="Solana"
                    width={16}
                    height={16}
                />
                <p className={`mt-[1px] transition-colors duration-200 ${getPriceChangeColor(sortedPrices?.[0]?.price, previousPrices.sol)}`}>
                    ${Number(sortedPrices?.[0]?.price).toFixed(2)}
                </p>
            </Card>
            <Card className="flex items-center justify-center gap-1 px-2 h-9 rounded-sm">
                <Image
                    src="/jup-logo-bright.svg"
                    alt="Jupiter"
                    width={16}
                    height={16}
                />
                <p className={`mt-[1px] transition-colors duration-200 ${getPriceChangeColor(sortedPrices?.[1]?.price, previousPrices.jup)}`}>
                    ${Number(sortedPrices?.[1]?.price).toFixed(2)}
                </p>
            </Card>
        </div>
    );
}