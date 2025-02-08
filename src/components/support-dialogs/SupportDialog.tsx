import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { CopyableSpan } from "../CopyClipboard";

export function SupportDialog() {
    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className="space-y-4">
                <DialogTitle className="text-xl sm:text-2xl text-center">
                    Support Development & Maintenance
                </DialogTitle>
                <DialogDescription asChild>
                    <div className="flex flex-col space-y-4">
                        <p className="text-center text-sm sm:text-base text-muted-foreground">
                            Your contribution helps us continue improving and maintaining this project. If you find our tools valuable, consider supporting us by donating SOL to:
                        </p>

                        <CopyableSpan
                            value="BnhJyF5FqE5Q82vZaznxdVSnTD7sSBrnVA7ZioqNvK7D"
                            className="text-xs sm:text-sm font-mono break-all"
                        />

                        <p className="text-center text-sm sm:text-base text-muted-foreground">
                            Every donation directly supports ongoing development, server costs, and new feature implementation. Thank you for your support!
                        </p>
                    </div>
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    );
}