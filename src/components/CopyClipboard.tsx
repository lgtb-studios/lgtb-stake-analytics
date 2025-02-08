'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

interface CopyButtonProps {
    value: string;
    onCopy?: () => void;
}

function CopyButton({ value, onCopy }: CopyButtonProps) {
    const [hasCopied, setHasCopied] = useState(false)


    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(value)
            setHasCopied(true)
            toast({
                description: "Copied to clipboard!",
                duration: 2000,
            })
            onCopy?.()
            setTimeout(() => setHasCopied(false), 2000)
        } catch {
            toast({
                variant: "destructive",
                description: "Failed to copy to clipboard",
            })
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 w-8 hover:bg-secondary"
        >
            {hasCopied ? (
                <Check className="h-4 w-4 text-green-500" />
            ) : (
                <Copy className="h-4 w-4" />
            )}
        </Button>
    )
}

export function CopyableText({ value }: { value: string }) {
    return (
        <div className="flex items-center space-x-2 w-full max-w-md">
            <Input
                value={value}
                readOnly
                className="font-mono text-sm bg-secondary/50"
            />
            <CopyButton value={value} />
        </div>
    )
}

export function CopyableSpan({
    value,
    className
}: {
    value: string;
    className?: string;
}) {
    return (
        <div className="flex items-center p-1 justify-between bg-secondary/50 rounded-lg hover:bg-secondary transition-colors w-full">
            <span className={`font-mono text-sm truncate ${className}`}>
                {value}
            </span>
            <CopyButton value={value} />
        </div>
    )
}