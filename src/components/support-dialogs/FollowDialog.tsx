import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";


export function FollowDialog() {
    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className="space-y-4">
                <DialogTitle className="text-xl sm:text-2xl text-center">
                    Follow Us
                </DialogTitle>
                <DialogDescription className="space-y-4">

                    Add social media links here and open in new tab

                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    );
}