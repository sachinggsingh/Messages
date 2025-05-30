"use client";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/app/schemas/signUp";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [usernameMsg, setUsernameMsg] = useState("");
    const [isCheckingUSername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubbmitting] = useState(false);
    const debounced = useDebounceCallback(setUsername, 500);
    const router = useRouter();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });
    useEffect(() => {
        const checkUserName = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMsg("");
                try {
                    const response = await axios.get(
                        `/api/check-username-unique?username=${username}`
                    );
                    setUsernameMsg(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMsg(
                        axiosError.response?.data.message ?? "Error Checking Username"
                    );
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        };
        checkUserName();
    }, [username]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubbmitting(true);
        try {
            const response = await axios.post<ApiResponse>("/api/sign-up", data);
            if (response.data.success) {
                toast.success(response.data.message);
                router.replace(`/verify/${username}`);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error in Sign-up:", error);
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMsg = axiosError.response?.data.message ?? "Something went wrong. Please try again.";
            toast.error(errorMsg);
        } finally {
            setIsSubbmitting(false);
        }
    };
    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-l from-slate-300 from-0% via-slate-200 via-50% to-slate-200 to-100%">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your credentials to sign in to your account
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>UserName</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Enter your UserName"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debounced(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                    {isCheckingUSername && <Loader2 className="animate-spin" />}
                                    <p className={`text-sm ${usernameMsg === "Username is available" ? 'text-red-500' : 'text-blue-500'}`}>
                                        {usernameMsg}
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="name@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter your password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing up...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                    </form>
                </Form>

                <div className="text-center text-sm">
                    Already have an Account?{" "}
                    <Link href="/sign-in" className="text-primary hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
