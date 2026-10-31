
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

// Check which email provider should be used.
// Local development uses Gmail; Render uses Resend.
const emailProvider = process.env.EMAIL_PROVIDER || "gmail";

// Configure Gmail SMTP for localhost.
const transporter = emailProvider === "gmail"
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
        }
    })
    : null;

// Configure Resend for Render Free using its HTTPS API.
const resend = emailProvider === "resend"
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

// Keep the same sendMail interface used by your controllers.
const mailer = {
    sendMail: async ({ from, to, subject, text }) => {

        // Send using Gmail SMTP.
        if (emailProvider === "gmail") {
            return transporter.sendMail({
                from,
                to,
                subject,
                text
            });
        }

        // Send using Resend HTTPS API.
        if (emailProvider === "resend") {
            const { data, error } = await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || "TinyNest <onboarding@resend.dev>",
                to,
                subject,
                text
            });

            if (error) {
                throw new Error(error.message);
            }

            return data;
        }

        throw new Error("Invalid EMAIL_PROVIDER configuration");
    }
};

export default mailer;
