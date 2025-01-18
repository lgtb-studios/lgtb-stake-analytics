'use client'
import { ThemeModeToggle } from "./ThemeModeToggle"

export function Header() {
    return (
        <nav className="flex items-center justify-between p-3 border-b">
            <div>
                <strong className="text-xl font-extrabold tracking-tight">LET&apos;S GET THIS BREAD</strong> <br />
                <span className="text-sm font-light tracking-[.25em] text-muted-foreground -mt-1 block leading-tight">ANALYTICS</span>
            </div>
            <ThemeModeToggle />
        </nav>
    )
}