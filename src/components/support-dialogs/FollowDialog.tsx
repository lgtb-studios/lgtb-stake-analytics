import {
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";


export function FollowDialog() {
    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className="space-y-4">
                <DialogTitle className="text-xl sm:text-2xl text-center">
                    Join The Duck Pond!
                </DialogTitle>
                <div className="space-y-4">
                    <div className="flex flex-col space-y-4">
                        <p className="text-center text-sm sm:text-base text-muted-foreground">
                            Keep up with the flock - get the latest $LGTB updates first!
                        </p>

                        <div className="flex flex-row justify-center items-center space-x-4">
                            <Link href="https://x.com/LGTBonSol" target="_blank" rel="noopener noreferrer">
                                <Image src="/socials/x.png" alt="X social" width={36} height={36} />
                            </Link>
                            <Link href="https://t.me/+kQeiojHoHmhhYTc0" target="_blank" rel="noopener noreferrer">
                                <Image src="/socials/telegram.png" alt="telegram" width={32} height={32} />
                            </Link>
                        </div>

                        <p className="text-center text-sm sm:text-base text-muted-foreground">
                            Waddle in and make some waves!
                        </p>
                    </div>
                </div>

            </DialogHeader>
        </DialogContent>
    );
}