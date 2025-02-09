'use client'
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Button } from './ui/button';
import { Input } from './ui/input';
//import { Switch } from './ui/switch';

const isSolanaAddress = (address: string) => {
    try {
        return address.length >= 32 && address.length <= 44;
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

export function AddressForm({ onSubmit, label }: { onSubmit: (address: string) => void; label?: string }) {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            address: "",
        },
    });

    const handleSubmit = (values: FormValues) => {
        onSubmit(values.address);
        form.reset();
    };
    //Not sure if I should implement this
    // const Lockwallet = () => {
    //     console.log("Lock wallet")
    // }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex items-center space-x-2 mt-4">
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem className="flex-1 ">
                            <FormControl>
                                <Input
                                    placeholder={`Enter ${label} address`}
                                    {...field}
                                    className="h-10 text-theme-color"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="h-10">Check</Button>
                {/* <div className='h-10'>
                    <p className='text-xs text-center font-bold'>Lock</p>
                    <Switch checked onCheckedChange={Lockwallet} />
                </div> */}
            </form>
        </Form>
    );
}