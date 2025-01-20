import Image from "next/image"
import { ThemeModeToggle } from "./ThemeModeToggle"

export function Header() {

    return (
        <nav className="flex items-center justify-between p-2 border-b">
            <div className="flex items-center gap-2">
                <Image src="/Welcome.png" alt="logo" width={50} height={50} />
                <div>
                    <strong className="text-xl font-extrabold tracking-tight">LET&apos;S GET THIS BREAD</strong> <br />
                    <span className="text-sm font-light tracking-[.25em] text-muted-foreground -mt-1 block leading-tight">ANALYTICS</span>
                </div>

            </div>
            <div className="flex items-center gap-1">
                <ThemeModeToggle />
            </div>

        </nav>
    )
}