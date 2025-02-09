'use client'
import * as React from 'react'
import { Check } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { VaultOptions, VaultSelection } from '@/lib/types'
import { CircleHelp } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface SearchableSelectorProps {
    options: VaultOptions[] | undefined
    placeholder?: string
    onSelect: (value: VaultSelection) => void
    isLoading?: boolean
}

export function Selector({
    options = [],
    onSelect,
    isLoading = false,
}: SearchableSelectorProps) {
    const [selectedValue, setSelectedValue] = React.useState('');
    const [isSelecting, setIsSelecting] = React.useState(false)

    const handleSelect = (value: string) => {
        const selectedOption = options.find(opt => opt.vault_address === value);
        if (selectedOption) {
            setIsSelecting(true);
            setSelectedValue(value);
            onSelect(selectedOption);
        }
    }

    React.useEffect(() => {
        if (!isLoading) {
            setIsSelecting(false);
        }
    }, [isLoading]);

    return (
        <Select value={selectedValue} onValueChange={handleSelect} disabled={isSelecting || isLoading}>
            <div className="flex flex-row items-center justify-between">
                <SelectTrigger className='pr-2'>
                    <SelectValue placeholder="Select a vault ">
                        {selectedValue ? options.find(opt => opt.vault_address === selectedValue)?.token_a_symbol : "Select a vault"}
                    </SelectValue>
                </SelectTrigger>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <CircleHelp className="h-5 w-5  ml-2 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <div className="p-1 text-xs">
                                Displays vaults with $10,000 or more in rewards
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <SelectContent>
                <ScrollArea className="h-[200px]">
                    {options.length > 0 ? (
                        options.map((option) => (
                            <SelectItem
                                key={option.vault_address}
                                value={option.vault_address}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{option.token_a_symbol}</span>
                                    {selectedValue === option.token_a_mint && (
                                        <Check className="h-4 w-4 ml-2" />
                                    )}
                                </div>
                            </SelectItem>
                        ))
                    ) : (
                        <div className="p-2 text-center text-muted-foreground">
                            No results found
                        </div>
                    )}
                </ScrollArea>
            </SelectContent>
        </Select>
    )
}