
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

// Select the email provider from the environment variables.
// Localhost: gmail
// Render: brevo
// Backup: resend
const emailProvider = process.env.EMAIL_PROVIDER || "gmail";

// ---------------------------------------------
// 1. Gmail configuration (local development)
// ---------------------------------------------
const transporter =
    emailProvider === "gmail"
        ? nodemailer.createTransport({
              service: "gmail",
              auth: {
                  user: process.env.EMAIL,
                  pass: process.env.EMAIL_PASS,
              },
          })
        : null;

// ---------------------------------------------
// 2. Resend configuration (backup provider)
// ---------------------------------------------
const resend =
    emailProvider === "resend"
        ? new Resend(process.env.RESEND_API_KEY)
        : null;

// ---------------------------------------------
// 3. Common email service
// ---------------------------------------------
const mailer = {
    sendMail: async ({ from, to, subject, text }) => {

        // Send emails using Gmail SMTP.
        if (emailProvider === "gmail") {
            return transporter.sendMail({
                from,
                to,
                subject,
                text,
            });
        }

        // Send emails using Resend HTTPS API.
        if (emailProvider === "resend") {
            const { data, error } = await resend.emails.send({
                from:
                    process.env.RESEND_FROM_EMAIL ||
                    "TinyNest <onboarding@resend.dev>",
                to,
                subject,
                text,
            });

            if (error) {
                throw new Error(error.message);
            }

            return data;
        }

        // Send emails using Brevo HTTPS API.
        if (emailProvider === "brevo") {

            // Convert recipients into Brevo's required format.
            const recipients = (Array.isArray(to) ? to : [to]).map(
                (recipient) =>
                    typeof recipient === "string"
                        ? { email: recipient }
                        : {
                              email: recipient.address || recipient.email,
                              ...(recipient.name && {
                                  name: recipient.name,
                              }),
                          }
            );

            // Send the email request to Brevo.
            const response = await fetch(
                "https://api.brevo.com/v3/smtp/email",
                {
                    method: "POST",
                    headers: {
                        "api-key": process.env.BREVO_API_KEY,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        sender: {
                            name: process.env.BREVO_FROM_NAME || "TinyNest",
                            email: process.env.BREVO_FROM_EMAIL,
                        },
                        to: recipients,
                        subject,
                        textContent: text,
                    }),
                }
            );

            // Read Brevo's response.
            const result = await response.json();

            // Handle unsuccessful email requests.
            if (!response.ok) {
                throw new Error(
                    result.message || "Brevo email delivery request failed"
                );
            }

            return result;
        }

        // Reject unsupported email providers.
        throw new Error("Invalid EMAIL_PROVIDER configuration");
    },
};

export default mailer;
