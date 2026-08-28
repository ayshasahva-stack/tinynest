import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected to mongoDb");

    } catch (error) {
        console.error("connection error", error);
        process.exit(1)
    }
}
export default connectDb