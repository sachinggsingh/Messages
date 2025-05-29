import { z } from "zod"
import UserModel from "../../models/User"
import connectDB from "../../lib/db"
import { usernameValidation } from "../../schemas/signUp"
import { NextResponse } from "next/server"


const UserNameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await connectDB();
    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        const result = UserNameQuerySchema.safeParse(queryParam)
        console.log(result);
        if (!result.success) {
            const errorUserName = result.error.format().username?._errors || [];
            return NextResponse.json({
                success: false,
                message: errorUserName.length > 0 ? errorUserName.join(',') : "Invalid Query Parameter"
            }, {
                status: 400
            })
        }

        const {username} = result.data
        const ExistingUserNameIsVerified = await UserModel.findOne({username, isVerified: true})
        if(ExistingUserNameIsVerified){
            return NextResponse.json({
                success: false,
                message: "Username Already exists"
            }, {
                status: 400
            })
        }

        return NextResponse.json({
            success: true,
            message: "Username is Unique",
        }, {
            status: 200
        })
    } catch (error) {
        console.error('Error in checking UserName', error);
        return NextResponse.json({
            message: "Error in checking UserName",
            success: false
        }, {
            status: 500
        })
    }

} 