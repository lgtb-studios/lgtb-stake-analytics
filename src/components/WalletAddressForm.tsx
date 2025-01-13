'use client'
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { PublicKey } from '@solana/web3.js';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Button } from './ui/button';
import { Input } from './ui/input';

const isSolanaAddress = (address: string) => {
    try {
        const pubKey = new PublicKey(address);
        return PublicKey.isOnCurve(pubKey);
    } catch {
        return false;
    }
};

const formSchema = z.object({
    address: z
        .string()
        .min(1, "Address is required")
        .refine(isSolanaAddress, {
            message: "Invalid Solana address"
        })
});

type FormValues = z.infer<typeof formSchema>;

export function WalletAddressForm({ onSubmit }: { onSubmit: (address: string) => void }) {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            address: "",
        },
    });

    const handleSubmit = (values: FormValues) => {
        onSubmit(values.address);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    placeholder="Enter Solana address"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Check</Button>
            </form>
        </Form>
    );
}