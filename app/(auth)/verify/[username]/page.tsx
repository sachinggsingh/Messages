"use client";
import { verifySchema } from "@/app/schemas/verify";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const VerifyAccount = () => {
    const router = useRouter();
    const params = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: "",
        },
    });

    const submit = async (data: z.infer<typeof verifySchema>) => {
        try {
            setIsSubmitting(true);
            const response = await axios.post<ApiResponse>(`/api/verify-code`, {
                username: params.username,
                code: data.code,
            });
            if (response.data.success) {
                toast.success(response.data.message);
                router.replace('/dashboard');
            }
        } catch (error) {
            console.error("Error in verifying code:", error);
            const axiosError = error as AxiosError<ApiResponse>;
            const message = axiosError.response?.data.message ?? "Verification failed";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-l from-slate-300 from-0% via-slate-200 via-50% to-slate-200 to-100%">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight">Verify Account</h1>
                    <p className="text-sm text-muted-foreground">
                        Please enter the verification code sent to your email.
                    </p>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(submit)} className="space-y-8 mt-4">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex justify-center text-center w-full">
                                            Verification Code
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="Enter verification code" 
                                                {...field} 
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button 
                                type="submit" 
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify Account"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default VerifyAccount;
