import UserModel from "../../models/User"
import connectDB from "../../lib/db"
import { NextResponse } from "next/server"



export async function POST(request: Request) {
    await connectDB()
    try {
        const { username, code } = await request.json()

        const decodedUserName = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUserName })
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "No User Found"
            }, { status: 400 })
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeNotExpired && isCodeValid) {
            user.isVerified = true;
            await user.save()

            return NextResponse.json({
                success: true,
                message: "Account is Verified",
            }, { status: 200 })
        } else if (!isCodeNotExpired) {
            return NextResponse.json({
                success: false,
                message: "Verification code is expired Please sign-up again to get the code"
            }, { status: 400 })
        } else {
            return NextResponse.json({
                succes: false,
                message: "Incorrect verification code",
            }, { status: 400 })
        }
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            success: false,
            message: "Problem in Verifiying code"
        }, { status: 500 })
    }
}