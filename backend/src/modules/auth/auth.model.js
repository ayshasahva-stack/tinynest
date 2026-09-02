import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true

        },

        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String,
            default: null
        },
        otpExpire: {
            type: Date,
            default: null
        },
        resetOtp: {
            type: String,
            default: null
        },
        resetOtpExpire: {
            type: Date,
            default: null
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        }
    },
    {
        timestamps: true
    }
)

// Hash the password before saving the user
userSchema.pre("save", async function () {

    // If the password wasn't changed, don't hash it again
    if (!this.isModified("password")) {
        return;
    }

    // Hash the plain-text password
    this.password = await bcrypt.hash(this.password, 10);


});

// Check whether the entered password matches the stored hash
userSchema.methods.isPasswordCorrect = async function (password) {

    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);


export default User