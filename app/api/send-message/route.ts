import UserModel from "@/app/models/User";
import connectDB from "@/app/lib/db";
import { Message } from "@/app/models/User";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    await connectDB()

    const { username, content } = await request.json();
    try {
        const user = await UserModel.findOne(username)
        if (!user) {
            return NextResponse.json({
                success: false,
                msg: "Not authenticated"
            }, { status: 404 })
        }

        // is user accepting the message

        if(!user.isAcceptingMessages){
            return NextResponse.json({
                success:false,
                msg:"User is not accepting the message"
            },{status:403})
        }

        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message)

        await user.save()
        return NextResponse.json({
            success:true,
            msg:"Message sent successfully"
        },{status:200})
    } catch (error) {
        console.error("Error in Sending message",error)
        return NextResponse.json({
            success:false,
            msg:"Error in sending the message"
        },{status:500})
    }
}