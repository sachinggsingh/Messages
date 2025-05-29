"use client";
import {  useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
// import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import { signUpSchema } from "@/app/schemas/signUp";
// import axios, { AxiosError } from "axios";
// import { ApiResponse } from "@/types/apiResponse";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    // FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/app/schemas/signIn";
import { signIn } from "next-auth/react";

const SignIn = () => {
    const [isSubmitting, setIsSubbmitting] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
          identifier:'',
            password: "",
        },
    });
  

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubbmitting(true);
        const response = await signIn('credentials',{
          redirect:false,
          indeitifier:data.identifier,
          password:data.password
        })
        console.log(response);
        if(response?.error){
          toast("Incorrect username for password");
        }
        if(response?.url){
          router.replace('dashboard');
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
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email/Username </FormLabel>
                                    <FormControl>
                                        <Input placeholder="email/username" {...field} />
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

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" />
                                <label
                                    htmlFor="remember"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Remember me
                                </label>
                            </div>
                            <Link
                                href="/forgot-password"
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                    </form>
                </Form>

                <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/sign-up" className="text-primary hover:underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
