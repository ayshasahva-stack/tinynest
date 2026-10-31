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
        // Store the user's full name.
        // Optional in the schema so existing registration continues to work.
        fullName: {
            type: String,
            trim: true,
            maxlength: 100,
            default: ""
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
        },
        isBlocked: {
            type: Boolean,
            default: false
        },

        // Hashed refresh token; never store the raw token in MongoDB.
        refreshTokenHash: {
            type: String,
            default: null
        },

        // Expiry date for the 7-day refresh session.
        refreshTokenExpire: {
            type: Date,
            default: null
        },

    },
    {
        timestamps: true
    }
)
userSchema.pre("save", async function () {

    // Skip hashing when transferring an already-hashed password
    // from PendingRegistration to the verified User document.
    if (this.$locals.passwordAlreadyHashed) {
        return;
    }

    // Don't hash the password again if it hasn't changed.
    if (!this.isModified("password")) {
        return;
    }

    // Hash a new or changed plain-text password.
    this.password = await bcrypt.hash(this.password, 10);
});

// Check whether the entered password matches the stored hash
userSchema.methods.isPasswordCorrect = async function (password) {

    return await bcrypt.compare(password, this.password);
};


// Temporary storage for users who haven't verified their email.
const pendingRegistrationSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        // This password is already hashed before being stored here.
        password: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        // Store only the hashed OTP.
        otp: {
            type: String,
            required: true
        },

        otpExpire: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Automatically delete pending registrations 24 hours after creation.
// OTP itself still expires after 10 minutes.
pendingRegistrationSchema.index(
    { createdAt: 1 },
    { expireAfterSeconds: 86400 }
);


// Main collection: verified user accounts.
const User = mongoose.model("User", userSchema);

// Temporary collection: registrations awaiting OTP verification.
const PendingRegistration = mongoose.model(
    "PendingRegistration",
    pendingRegistrationSchema
);

export { PendingRegistration };

export default User;