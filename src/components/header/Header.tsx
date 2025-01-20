'use client'
import { useEffect, useState } from "react";
import { HeadPriceDisplay } from "./HeadPriceDisplay"
import { ThemeModeToggle } from "./ThemeModeToggle"
import { getSOLJUPPrice } from "@/lib/Web3";
import { HeadPrices } from "@/lib/types";

export function Header() {

    const [prices, setPrices] = useState<HeadPrices[]>([]);

    useEffect(() => {
        let mounted = true;
        let intervalId: NodeJS.Timeout;
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

        // eslint-disable-next-line prefer-const
        intervalId = setInterval(fetchPrices, 10000);
        return () => {
            mounted = false;
            clearInterval(intervalId);
        };
    }, []);

    return (
        <nav className="flex items-center justify-between p-3 border-b">
            <div>
                <strong className="text-xl font-extrabold tracking-tight">LET&apos;S GET THIS BREAD</strong> <br />
                <span className="text-sm font-light tracking-[.25em] text-muted-foreground -mt-1 block leading-tight">ANALYTICS</span>
            </div>
            <div className="flex items-center gap-1">
                <HeadPriceDisplay prices={prices} />
                <ThemeModeToggle />
            </div>

        </nav>
    )
}