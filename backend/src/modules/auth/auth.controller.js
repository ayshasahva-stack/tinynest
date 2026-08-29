import crypto from 'crypto'
import bcrypt from 'bcrypt'

import User from './auth.model.js'
import transporter from '../../integrations/email/mail.js'
import ApiError from '../../utils/Apierror.js'
import sendSuccessResponse from '../../utils/ApiResponse.js'
import { validateRegistration } from './auth.validation.js'


export const register = async (req, res, next) => {

    try {

        const { error, data } = validateRegistration(req.body)

        if (error) {
            return next(new ApiError(400, error))
        }

        const { email, password, phone } = data;
        const existinguser = await User.findOne({ email })

        if (existinguser) {
            return next(new ApiError(409, "Email is already registerd "))
        }

        const otp = crypto.randomInt(100000, 1000000).toString()

        const hashedOtp = await bcrypt.hash(otp, 10);

        const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

        const user = new User({
            email,
            password,
            phone,
            otp: hashedOtp,
            otpExpire,
            isVerified: false
        })

        await user.save()

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Verify your tinynest account",
            text: `Your verification OTP is ${otp}. It expires in 10 minutes.`
        })
        sendSuccessResponse(res, 201, null, "Registration successful. Please verify the OTP sent to your email.")


    } catch (error) {
        next(error);
    }

}