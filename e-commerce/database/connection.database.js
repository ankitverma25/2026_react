import mongoose from "mongoose";
import "dotenv/config";

const url=process.env.MONGO_URI;


const connectDB =async()=>{
    try {
        await mongoose.connect(url);
        console.log('Database connected sucessfully');
        
    } catch (error) {
        console.log('connection failed',error)
        process.exit(1)
        
    }
}


export default connectDB;

