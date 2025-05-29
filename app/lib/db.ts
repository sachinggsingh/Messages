import mongoose from "mongoose";

type ConnectionObject = {
    isConnection? : number
}


const connection : ConnectionObject = {}

async function connectDB() : Promise<void>{
    if(connection.isConnection)
    {
        console.log("DB is connected")
        return  
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URL || '')
        connection.isConnection = db.connections[0].readyState
        console.log("DB connected successfullly");
    } catch (error) {
        console.error(error)
        console.log("DB connection failed")
        process.exit(1)
    }
}



export default connectDB;