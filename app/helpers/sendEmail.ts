import { resend } from "../lib/resend";
import {EmailTemplate} from "@/components/emailVerification"
import { ApiResponse } from "@/types/apiResponse";
import React from 'react';

export async function sendVerification(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse> {
    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verify your email address',
            react: EmailTemplate({ firstName: username, verifyCode }) as React.ReactElement,
            text: `Your verification code is: ${verifyCode}`,
        });

        if (data.error) {
            throw new Error(data.error.message);
        }

        return { success: true, message: 'Verification email sent successfully' };
    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, message: 'Failed to send verification email' };
    }
}