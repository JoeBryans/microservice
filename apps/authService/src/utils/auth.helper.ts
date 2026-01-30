import { client } from "@repos/redis";
import e, { NextFunction } from "express";
import { sendEmail } from "./sendMail/sendMail";
import { HttpErrorNotFound, HttpErrorUnauthorized } from "@repose/error";

export const checkOtpRestriction = async (email: string, next: NextFunction) => {
   console.log("checkOtpRestriction: ", email);
   const otp_key = `auth:otp:${email}`;
   const otp_isLocked_key = `auth:otp_locked:${email}`;
   const otp_spamLock_key = `auth:otp_spamLock:${email}`;
   const otp_cooldown_key = `auth:otp_cooldown:${email}`;


   if (await client.get(otp_isLocked_key)) {
      throw next(new HttpErrorUnauthorized("Account is locked due to too many failed attempts! try again after 30 minutes", true, "unauthorized"));
   }
   if (await client.get(otp_spamLock_key)) {
      throw next(new HttpErrorUnauthorized("Too many OTP requests! Please wait for 1hour and try again", true, "unauthorized"));
   }
   const cooldown = await client.get(otp_cooldown_key);
   console.log("cooldown: ", cooldown);
   if (cooldown && cooldown === "true") {

      throw next(new HttpErrorUnauthorized("OTP is on cooldown! Please wait for 1 minutes and try again", true, "unauthorized"));
   }
   return true;
}

export const trackOtpRequest = async (email: string, next: NextFunction) => {
   console.log("trackOtpRequest: ", email);
   const otp_request_count_key = `auth:otp_requestCount:${email}`;
   const otp_spamLock_key = `auth:otp_spamLock:${email}`;

   let otp_request_count = parseInt(await client.get(otp_request_count_key) || "0");

   if (otp_request_count >= 3) {
      await client.set(otp_spamLock_key, "locked", { "EX": 3600 });
      return next(new HttpErrorUnauthorized("Too many OTP requests! Please wait for 1hr and try again", true, "unauthorized"));
   }
   console.log("otp_request_count: ", otp_request_count);
   await client.set(otp_request_count_key, otp_request_count + 1, { "EX": 3600 });
   return otp_request_count;
}

export const sendOtp = async (email: string, name: string, template: string) => {
   console.log("sendOtp: ", email);

   const otp = generateOtp();
   // console.log("otp: ", otp);

   //  sendEmail
   await sendEmail(email, "Email Verification", template, {
      appName: "eShopping",
      otp,
      name,
      supportEmail: process.env.SMTP_USER,
      tagline: "Secure your account"
   });
   const otp_key = `auth:otp:${email}`;
   const otp_cooldown_key = `auth:otp_cooldown:${email}`;

   await client.set(otp_key, otp, { "EX": 300 });
   await client.set(otp_cooldown_key, "true", { "EX": 60 });

   return otp;

}

export const  sendEmailVerification = async (email: string, template: string) => {
   const otp = generateOtp();
   const verify_email_key = `auth:verify_email:${email}`;
   const otp_cooldown_key = `auth:otp_cooldown:${email}`;

   sendEmail(email, "Email Verification", template, {
      appName: "eShopping",
      otp,
      supportEmail: process.env.SMTP_USER,
      tagline: "Secure your account"
   });

   await client.set(verify_email_key, otp, { "EX": 60 * 60*1 });
   await client.set(otp_cooldown_key, "true", { "EX": 60 });
   return otp;
}

export const verifyOtp = async (email: string, otp: string, next: NextFunction) => {
   const otp_key = `auth:otp:${email}`;
   const otp_locked_key = `auth:otp_locked:${email}`;
   if (!email || !otp) {
      throw next(new HttpErrorNotFound("email or otp is missing", true, "not found"));
   }

   const storedOtp = await client.getDel(otp_key);
   console.log("storedOtp: ", storedOtp);


   if (!storedOtp) {
      throw next(new HttpErrorNotFound("expired or Invalid OTP", true, "not found"));
   }
   const failed_attempts_key = `auth:otp_attempts:${email}`;
   const failed_attempts = parseInt(await client.get(failed_attempts_key) || "0");


   if (storedOtp !== otp) {
      if (failed_attempts >= 3) {
         console.log("failed_attempts: ", failed_attempts);

         await client.set(otp_locked_key, "locked", { "EX": 1800 });
         await client.del([otp_key, failed_attempts_key]);
         throw next(new HttpErrorUnauthorized("Too many failed attempts! Please wait for 1hr and try again", true, "unauthorized"));
      }
      await client.set(failed_attempts_key, failed_attempts + 1, { "EX": 300 });

      throw next(new HttpErrorUnauthorized(`Invalid OTP ${2 - failed_attempts} attempts left`, true, "unauthorized"));
   }

   await client.del([otp_key, failed_attempts_key]);
   return true;

}
export const verifyEmail= async (email: string, otp: string, next: NextFunction) => {

   console.log("emailVerificationOtp: ", otp);
   
   const verify_email_key = `auth:verify_email:${email}`;

   const otp_locked_key = `auth:otp_locked:${email}`;
   if (!email || !otp) {
      throw next(new HttpErrorNotFound("email or otp is missing", true, "not found"));
   }

   const storedOtp = await client.getDel(verify_email_key);
   console.log("storedOtp: ", storedOtp);


   if (!storedOtp) {
      throw next(new HttpErrorNotFound("expired or Invalid OTP", true, "not found"));
   }
   const failed_attempts_key = `auth:otp_attempts:${email}`;
   const failed_attempts = parseInt(await client.get(failed_attempts_key) || "0");


   if (storedOtp !== otp) {
      if (failed_attempts >= 3) {
         console.log("failed_attempts: ", failed_attempts);

         await client.set(otp_locked_key, "locked", { "EX": 1800 });
         await client.del([verify_email_key, failed_attempts_key]);
         throw next(new HttpErrorUnauthorized("Too many failed attempts! Please wait for 1hr and try again", true, "unauthorized"));
      }
      await client.set(failed_attempts_key, failed_attempts + 1, { "EX": 300 });

      throw next(new HttpErrorUnauthorized(`Invalid OTP ${2 - failed_attempts} attempts left`, true, "unauthorized"));
   }

   await client.del([verify_email_key, failed_attempts_key]);
   return true;

}


const generateOtp = () => {
   const otp = Math.floor(100000 + Math.random() * 900000).toString();
   console.log("otp: ", otp);
   return otp;
}