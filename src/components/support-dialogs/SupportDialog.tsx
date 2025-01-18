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
                    Support Project
                </DialogTitle>
                <DialogDescription asChild>
                    <div className="flex flex-col space-y-4">
                        <span className="text-center text-sm sm:text-base text-muted-foreground">
                            Support this project by donating SOL to
                        </span>

                        <CopyableSpan
                            value="Some address"
                            className="text-xs sm:text-sm font-mono break-all"
                        />

                        <span className="text-center text-sm sm:text-base text-muted-foreground">
                            Thank you for your support!
                        </span>
                    </div>
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    );
}