'use client'
import * as React from 'react'
import { Check, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { VaultOptions } from '@/lib/types'

interface SearchableSelectorProps {
    options: VaultOptions[]
    placeholder?: string
    onSelect: (value: string) => void
}

export function SearchableSelector({
    options = [],
    placeholder = 'Search vaults...',
    onSelect
}: SearchableSelectorProps) {
    const [searchQuery, setSearchQuery] = React.useState('')
    const [selectedValue, setSelectedValue] = React.useState('')

    const filteredOptions = options.filter(option =>
        option.token_a_symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.vault_address.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSelect = (value: string) => {
        setSelectedValue(value)
        onSelect(value)
    }

    return (
        <Select value={selectedValue} onValueChange={handleSelect}>
            <SelectTrigger>
                <SelectValue placeholder="Select a vault">
                    {selectedValue ? options.find(opt => opt.vault_address === selectedValue)?.token_a_symbol : "Select a vault"}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                <div className="px-2 py-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={placeholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                    setSearchQuery('')
                                }
                            }}
                            className="pl-8"
                        />
                    </div>
                </div>
                <ScrollArea className="h-[200px]">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <SelectItem
                                key={option.vault_address}
                                value={option.vault_address}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{option.token_a_symbol}</span>
                                    {selectedValue === option.vault_address && (
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