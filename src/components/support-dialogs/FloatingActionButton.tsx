'use client'
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Send, Rss } from "lucide-react";
import { useRef, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DialogType } from "@/lib/types";
// import { ReportDialog } from "./ReportDialog";
import { SupportDialog } from "./SupportDialog";
import { FollowDialog } from "./FollowDialog";
import { Suprise } from "./Suprise";

export function FloatingActionButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogType, setDialogType] = useState<DialogType>();
    const menuRef = useRef<HTMLDivElement>(null);

    return (

        <div className="hidden md:fixed md:bottom-0 md:right-4 md:block z-50">
            <Suprise isOpen={isOpen} />
            <Dialog>
                <div className="relative">
                    <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className="flex items-center gap-.5 px-2 rounded-t-lg rounded-b-none h-6 
              bg-primary hover:bg-primary/90 shadow-lg transition-colors"
                            >
                                <span className="text-xs pt-1 mr-1">Support</span>
                                {isOpen ? (
                                    <ChevronUp className="h-4 w-4 pt-1 transition-transform" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 pt-1 transition-transform" />
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            ref={menuRef}
                            className="w-40 mb-2"
                            align="end"
                            sideOffset={-6}
                            onCloseAutoFocus={(event) => {
                                event.preventDefault();
                            }}
                        >
                            <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => {
                                    e.preventDefault();
                                    setDialogType("follow");
                                }}>
                                    <Rss className="h-4 w-4 mr-2" />
                                    Follow Us
                                </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => {
                                    e.preventDefault();
                                    setDialogType("support");
                                }}>
                                    <Send className="h-4 w-4 mr-2" />
                                    Support
                                </DropdownMenuItem>
                            </DialogTrigger>
                            {/* <DialogTrigger asChild>

                                <DropdownMenuItem onSelect={(e) => {
                                    e.preventDefault();
                                    setDialogType("report");
                                }}>
                                    <Bug className="h-4 w-4 mr-2" />
                                    Report Bug
                                </DropdownMenuItem>
                            </DialogTrigger> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {/* {dialogType === 'report' && <ReportDialog />} */}
                    {dialogType === 'support' && <SupportDialog />}
                    {dialogType === 'follow' && <FollowDialog />}
                </div>
            </Dialog>

        </div>

    );
}