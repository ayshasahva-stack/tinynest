import mongoose from "mongoose";

const userSchema=new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true,
            lowecase:true,
            trim:true

        },

        password:{
            type:String,
            required:true,
        },
        phone:{
            type:Number,
            required:true,
            trim:true
        },
        isVerified:{
            type:Boolean,
            default:false,
        },
        otp:{
            type:String,
            default:false
        },
        otpExpire:{
            type:Date,
            default:null
        },
        role:{
            type:String,
            enum:["user","admin"],
            default:"user"
        }
    },
    {
        timestamps:true
    }
)

const User= mongoose.model("User",userSchema);

export default User