'use client'
import { HeadPrices } from "@/lib/types";
import Image from "next/image";
import { Card } from "./ui/card";
import { useEffect, useMemo, useState } from "react";
import { getSOLJUPPrice } from "@/lib/Web3";

function getPriceChangeColor(currentPrice: string, previousPrice: string) {
    if (!previousPrice) return '';
    if (currentPrice > previousPrice) return 'text-green-500';
    if (currentPrice < previousPrice) return 'text-red-500';
    return '';
}

export function HeadPriceDisplay() {
    const [prices, setPrices] = useState<HeadPrices[]>([]);
    const [previousPrices, setPreviousPrices] = useState<{ [key: string]: string }>({});

    const sortedPrices = useMemo(() =>
        prices?.sort((a, b) => {
            if (a.key.includes('So1')) return -1;
            if (b.key.includes('So1')) return 1;
            return 0;
        }),
        [prices]
    );

    useEffect(() => {
        const mounted = { current: true };

        const fetchPrices = async () => {
            try {
                const priceData = await getSOLJUPPrice();
                if (mounted) {
                    setPrices(priceData || []);
                }

            } catch (error) {
                console.error('Error fetching vaults:', error);
            }
        };
        fetchPrices();
        const intervalId = setInterval(fetchPrices, 5000);

        return () => {
            mounted.current = false;
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        if (sortedPrices?.length) {
            if (!previousPrices.sol && !previousPrices.jup) {
                setPreviousPrices({
                    sol: sortedPrices[0]?.price.toString(),
                    jup: sortedPrices[1]?.price.toString()
                });
            } else {
                const timeoutId = setTimeout(() => {
                    setPreviousPrices({
                        sol: sortedPrices[0]?.price,
                        jup: sortedPrices[1]?.price,
                    });
                }, 1000);
                return () => clearTimeout(timeoutId);
            }
        }
    }, [sortedPrices, previousPrices.sol, previousPrices.jup]);

    return (
        <div className="flex items-center gap-1">
            <Card className="flex items-center justify-center gap-1 px-2 h-9 rounded-lg">
                <Image
                    src="/solanaLogoMark.svg"
                    alt="Solana"
                    width={14}
                    height={14}
                />
                <p className={`text-sm font-semibold  transition-colors duration-200 ${getPriceChangeColor(sortedPrices?.[0]?.price, previousPrices.sol)}`}>
                    ${Number(sortedPrices?.[0]?.price).toFixed(2)}
                </p>
            </Card>
            <Card className="flex items-center justify-center gap-1 px-2 h-9 rounded-lg">
                <Image
                    src="/jup-logo-bright.svg"
                    alt="Jupiter"
                    width={14}
                    height={14}
                />
                <p className={`text-sm font-semibold  transition-colors duration-200 ${getPriceChangeColor(sortedPrices?.[1]?.price, previousPrices.jup)}`}>
                    ${Number(sortedPrices?.[1]?.price).toFixed(2)}
                </p>
            </Card>
        </div>
    );
}