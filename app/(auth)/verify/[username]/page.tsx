"use client";
import { verifySchema } from "@/app/schemas/verify";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const VerifyAccount = () => {
    const router = useRouter();
    const params = useParams();
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    });

    const submit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post<ApiResponse>(`/api/verify-code`, {
                username: params.username,
                code: data.code,
            });
            if (response.data.success) {
                toast.success(response.data.message);
            }
            router.replace("sign-in");
        } catch (error) {
            console.error("Error in Server in code verifying", error);
            const axiosError = error as AxiosError<ApiResponse>;
            const message =
                axiosError.response?.data.message ?? "Verification failed";
            toast.error(message);
        }
    };
    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-l from-slate-300 from-0% via-slate-200 via-50% to-slate-200 to-100%">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight">Verify Account</h1>
                    <p className="text-sm text-muted-foreground">
                        Please enter the verificatiin code sent on the email.
                    </p>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(submit)} className="space-y-8 mt-4">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel className="flex justify-center text-center w-full">Verification Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Verify Code" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public display name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default VerifyAccount;
