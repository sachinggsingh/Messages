import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import connectDB from "@/app/lib/db";
import { User } from "next-auth";
import { NextResponse } from "next/server";
import UserModel from "@/app/models/User";

export async function DELETE(request:Request,{params}:{params:{messageid:string}}){
  const messageID = params.messageid;
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
    try {
        const response = await UserModel.updateOne(
          {_id:user._id},
          {$pull : {messages:{_id:messageID}}},
        )
        if(response.modifiedCount == 0){
          return NextResponse.json({
            success:false,
            msg:"Message not found or alreadty  deleted",
          },{status:401});
        }
        return NextResponse.json({
          success:true,
          msg:"Message deleted",
        },{status:200});
    } catch (error) {
        console.error("Error in Deletinf the message",error);
        return NextResponse.json({
          success:false,
          msg:"Internal Server Error in Deleting the message"
        },{status:500})
    }
  
   

}
