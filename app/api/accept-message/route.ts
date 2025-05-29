import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import connectDB from "@/app/lib/db";
import { User } from "next-auth";
import { NextResponse } from "next/server";
import UserModel from "@/app/models/User";

export async function POST(request: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        msg: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userID = user._id;
  const { acceptMessage } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userID,
      { isAcceptingMessages: acceptMessage },
      { new: true }
    );

    if(!updatedUser){
        return NextResponse.json({
            success:false,
            msg:"failed to update the user"
        },{status:401})
    }
    return NextResponse.json(
        {
          success: false,
          msg: "Message Acceptance status updated successfully",updatedUser 
        },
        { status: 200 }
      );
  } catch (error) {
    console.error("failed to update user status to accept message", error);
    return NextResponse.json(
      {
        success: false,
        msg: "failed to update user status to accept message",
      },
      { status: 500 }
    );
  }
}

export async function GET(){
    await connectDB();
    try {
        const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          msg: "Not authenticated",
        },
        { status: 401 }
      );
    }
  
    const userID = user._id;
    const userFound = await UserModel.findById(userID)
    if(!userFound){
        return NextResponse.json({
            msg:"User Not Found",
            success:false
        },{status:404})
    }
    return NextResponse.json({
        success:true,
        isAcceptingMessage : userFound.isAcceptingMessages,
    },{status:200})
    } catch (error) {
        console.error("User not found",error)
        return NextResponse.json({
            msg:"Error in Accepting Messages"
        },{status:500})
    }
}
