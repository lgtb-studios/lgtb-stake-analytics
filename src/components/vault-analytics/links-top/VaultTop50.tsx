import { useVault } from "../../providers/VaultDataProvider";
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { TopStakerRows } from "./TopStakerRows";
import { ScrollArea } from "@/components/ui/scroll-area";

export function VaultTop50() {
    const { vaultData } = useVault();
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Badge variant="outline" className="h-5 text-[12px] p-3 cursor-pointer">
                        Top Stakers
                    </Badge>
                </DialogTrigger>
                <DialogContent className="md:max-w-[650px]">
                    <DialogHeader>
                        <DialogTitle>Top Stakers</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[500px] w-full rounded-md">
                        <div className="gap-1 pr-4">
                            {vaultData && vaultData?.top_lists.map((staker, index) => (
                                <TopStakerRows key={index} staker={staker} />
                            ))}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Badge variant="outline" className="h-5 text-[12px] p-3 cursor-pointer">Top Stakers</Badge>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Top Stakers</DrawerTitle>
                </DrawerHeader>
                <ScrollArea className="h-[380px] w-full rounded-md">
                    <div className="space-y-2 p-1">
                        {vaultData && vaultData?.top_lists.map((staker, index) => (
                            <TopStakerRows key={index} staker={staker} />
                        ))}
                    </div>
                </ScrollArea>


                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}