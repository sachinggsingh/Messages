import connectDB from "@/app/lib/db";
import UserModel from "@/app/models/User";
import bcrypt from "bcryptjs";
import { sendVerification } from "@/app/helpers/sendEmail"
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await connectDB();
        const { email, username, password } = await request.json();
        
        // Check if verified user exists with username
        const isExistingUserVerified = await UserModel.findOne({ username, isVerified: true });
        if (isExistingUserVerified) {
            return NextResponse.json({
                success: false,
                message: "Username is already taken"
            }, {
                status: 400
            });
        }

        // Check if user exists with email
        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: "User already exists with this email"
                }, {
                    status: 400
                });
            }
            
            // Update existing unverified user
            const hashPassword = await bcrypt.hash(password, 10);
            existingUserByEmail.password = hashPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
            await existingUserByEmail.save();
        } else {
            // Create new user
            const hashPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            });
            await newUser.save();
        }

        // Send verification email
        const emailResponse = await sendVerification(email, username, verifyCode);
        if (!emailResponse.success) {
            return NextResponse.json({
                success: false,
                message: emailResponse.message
            }, {
                status: 500
            });
        }

        return NextResponse.json({
            success: true,
            message: "User registered successfully. Please verify your email."
        }, {
            status: 201
        });

    } catch (error) {
        console.error("Error in registering user:", error);
        return NextResponse.json({
            success: false,
            message: "Error in registering user. Please try again."
        }, {
            status: 500
        });
    }
}