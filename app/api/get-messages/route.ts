import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import connectDB from "@/app/lib/db";
import { User } from "next-auth";
import { NextResponse } from "next/server";
import UserModel from "@/app/models/User";
import mongoose from "mongoose";

export async function GET(){
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
  
    const userID = new mongoose.Types.ObjectId(user._id)
    try {
        const user = await UserModel.aggregate([
            {$match : {$id: userID}},
            {$unwind:'messages'},
            {$sort: {'messages.createdAt':-1}},
            {$group: {_id:'$_id',messages:{$push:"$messages"}}}
        ])
        if(!user || user.length===0){
            return NextResponse.json({
                success:false,
                msg:"User not found"
            },{status:400})
        }
        return NextResponse.json({
            success:true,
            messages:user[0].messages   
        },{status:400})


    } catch (error) {
        console.error("Error in ",error)
    }

}
