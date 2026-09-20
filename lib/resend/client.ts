import { Resend } from "resend";

// Prevent crashes if the key isn't provided during build/local dev
const resendApiKey = process.env.RESEND_API_KEY || "re_dummy";
export const resend = new Resend(resendApiKey);

// A helper for the FROM email address
// During testing without a custom domain, you can only send FROM onboarding@resend.dev TO your verified email address.
export const EMAIL_FROM = process.env.EMAIL_FROM || "onboarding@resend.dev";
