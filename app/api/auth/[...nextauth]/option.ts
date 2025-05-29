import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "@/app/models/User";
import connectDB from "@/app/lib/db";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id : "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text "    },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials:any): Promise<any> {
                await connectDB()
                try {
                    const user = await UserModel.findOne({
                        $or : [
                            {email:credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })
                    if(!user) {
                        throw new Error(`No User found with this email`)
                    }
                    if(!user.isVerified){
                        throw new Error(`Please Verify the Email`);
                    }
                    const isMatched = await bcrypt.compare(credentials.password,user.password)
                    if(isMatched){
                        return user
                    }else{
                        throw new Error("Incorrect PAssword");
                    }
                } catch (err: any) {
                    throw new Error(err);
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id?.toString();
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;

            }
            return session
          },
          async jwt({ token, user, }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages  = user.isAcceptingMessage;
                token.username = user.username
            }
            return token
          }
    },
    pages:{
        signIn: '/sign-in',
    },
    session :{
        strategy : "jwt"
    },
    secret:process.env.NEXT_AUTH_SECRET
}