import bcrypt from "bcryptjs";
import { NextFunction, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { HttpErrorNotFound, HttpErrorUnauthorized } from "@repose/error";

import User from "../models/user";
import { createRefreshToken } from "../refreshToken/refresh-token";
import { createAccessToken } from "../accessToken/access-token";
import { client } from "@repos/redis";
import { checkOtpRestriction, sendEmailVerification, sendOtp, trackOtpRequest, verifyEmail, verifyOtp } from "../utils/auth.helper";
import axios from "axios";
import { PublishEvent } from "../utils/producer";
import { verifyRefreshToken } from "../refreshToken/verify-refresh-token";
import { HashToken } from "../utils/hash-token";
import Jwt from "jsonwebtoken";
import { verifyAccessToken } from "../accessToken/verify-access-token";


interface UserInfo {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: "SELLER" | "USER" | "ADMIN";
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
    __v: number;
}
export class AuthService {
    constructor() { }
    async register(userData: UserInfo, next: NextFunction): Promise<UserInfo|any> {
        const exitingUser = await this.findUserByEmail(userData.email);
        if (exitingUser) {
            throw new HttpErrorUnauthorized("User already exists", true, "unauthorized",);
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = await User.create({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: userData.role,
            phone: userData.phone,
            verified: true,
            isActive: true,
        });
        const { password, __v, ...userDataWithoutPassword } = newUser.toObject();

        const token = Jwt.sign({
            sub: newUser._id,
            isVerified: true,
            email: userData.email,
        }, process.env.ACCESS_TOKEN_SECRET!,
    {
        expiresIn: "15m",
    })

        return { user: userDataWithoutPassword, token } as any;
    };

    async checkEmail(email: string, next: NextFunction): Promise<any> {
        try {

            await checkOtpRestriction(email, next);
            await trackOtpRequest(email, next);
            await sendEmailVerification(email, "verify-email-template");

            const token = Jwt.sign({
                email,
                step: "EMAIL_VERIFIED"

            }, process.env.JWT_SECRET!);

            return token;
        } catch (error) {
            console.error("checkEmail error: ", error);
            throw error;
        }
    };

    async verifyEmail(token: string, otp: string, next: NextFunction) {
        try {


            const decodedToken = Jwt.verify(token, process.env.JWT_SECRET!) as any;
            console.log("decodedToken: ", decodedToken);
            console.log("decodedTokenEmail: ", decodedToken?.email);
            const email = decodedToken?.email;
            if (!email) {
                throw new HttpErrorUnauthorized("Invalid token", true, "unauthorized");
            }


            verifyEmail(email, otp, next);

            const Jwt_token = Jwt.sign(
                {
                    email,
                    isVerified: true,

                }, process.env.JWT_SECRET!,
                {
                    expiresIn: "15m",
                }
            );

            return Jwt_token;
        } catch (error) {
            console.error("verifyEmail error: ", error);
            throw error;
        }
    }

    async OtpResend(email: string, next: NextFunction): Promise<any> {
        const exitingUser = await this.findUserByEmail(email) as UserInfo;

        await checkOtpRestriction(email, next);
        const track = await trackOtpRequest(email, next);
        console.log("trackOtpRequest: ", track);
        const otp = await sendOtp(email, exitingUser.name, "verify-email-template");
        return otp;
    };

    async emitEvent(userData: UserInfo) {
        console.log("emitEvent:", userData);

        try {

            if (userData.role === "SELLER") {
                const ROUTING_KEY = "seller.created";
                const result = await PublishEvent(userData, ROUTING_KEY);
                console.log("seller.created: ", result);
            }
            if (userData.role === "USER") {
                const ROUTING_KEY = "user.created";
                const result = await PublishEvent(userData, ROUTING_KEY);
                console.log("user.created: ", result);
            }


            return "create.data.success";
        } catch (err) {
            const error: any = new Error("Event emission failed");
            error.code = "EVENT_EMIT_FAILED";
            error.userId = userData._id;
            throw error;
        }

    };

    async login(userData: any, res: Response): Promise<{ accessToken: string, refreshToken: string, user: UserInfo }> {
        // console.log(userData);

        const user = await this.findUserByEmail(userData.email);
        // console.log("user: ", user);
        if (!user) {
            throw new HttpErrorUnauthorized("invalid email or password", true, "unauthorized");
        }
        const isPasswordMatch = await bcrypt.compare(userData.password, user.password);
        // console.log("pass: ",isPasswordMatch);

        if (!isPasswordMatch) {
            throw new HttpErrorUnauthorized("invalid email or password", true, "unauthorized");
        }

        const accessToken = createAccessToken(user);


        const refreshToken = createRefreshToken(user);

        const hashToken = HashToken(refreshToken);

        const refreshToken_key = `auth:refreshToken:${user._id}`;
        const redis = await client.set(refreshToken_key, hashToken, { "EX": 60 * 60 * 24 * 7 });
        // const redisRefreshToken = await client.get(refreshToken_key);

        return {
            refreshToken,
            accessToken,
            user,
        }

    };

    async refreshToken(refreshToken: string, next: NextFunction): Promise<any> {
        try {
            const token = await verifyRefreshToken(refreshToken, next);
            // console.log("token: ", token?.sub);
            const refreshToken_key = `auth:refreshToken:${token?.sub}`;
            const redisRefreshToken = await client.get(refreshToken_key);
          
            // console.log("redisRefreshToken: ", redisRefreshToken);

            if (!redisRefreshToken) {
                throw new HttpErrorUnauthorized("token not found", true, "unauthorized");
            }

            const isHashToken = HashToken(refreshToken);
            // console.log("hashToken: ", isHashToken);

            if (redisRefreshToken !== isHashToken) {
                await client.del(refreshToken_key);
                throw new HttpErrorUnauthorized("token not found", true, "unauthorized");
            }

            const newAccessToken = createAccessToken(token);
            const newRefreshToken = createRefreshToken(token);
            const hashToken = HashToken(newRefreshToken);

            // console.log("newHashToken: ", hashToken);

            await client.set(refreshToken_key, hashToken, { "EX": 60 * 60 * 24 * 7 });

           const decode=verifyAccessToken(newAccessToken)
            // console.log("decode: ",decode);

            return {
                newAccessToken,
                newRefreshToken,
                decode,
            };
        } catch (error) {
            console.error("refreshToken error: ", error);
            next(error);
        }
    }

    async VerifyOtp(email: string, otp: string, next: NextFunction) {
        try {
            const user = await this.findUserByEmail(email);
            if (!user) {
                throw new HttpErrorUnauthorized("User not found", true, "not found");
            }
            return verifyOtp(email, otp, next);
        } catch (error) {
            console.error("VerifyOtp error: ", error);
            return next(error);
        }
        // return true
    }

    async findUserByEmail(email: string): Promise<UserInfo | null> {
        const user = await User.findOne({ email });
        //    console.log("find user: ",user);
        return user as any;
    }

    async resetPassword(email: string, password: string, newPassword: string, next: NextFunction) {
        try {
            const user = await this.findUserByEmail(email);
            if (!user) {
                throw new HttpErrorUnauthorized("User not found", true, "not found");
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                throw new HttpErrorUnauthorized("Invalid password", true, "unauthorized");
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const userData = await User.findOneAndUpdate({ email: email }, { password: hashedPassword }, { new: true });
            console.log("userData: ", userData);
            return userData;
        } catch (error) {
            console.error("resetPassword error: ", error);
            throw error;
        }
    }

    async forgotPassword(email: string, next: NextFunction) {
        try {
            const user = await this.findUserByEmail(email);

            if (!user) {
                throw new HttpErrorUnauthorized("User not found", true, "not found");
            }


            const otp = await sendOtp(email, user.name, "password-reset-template");
            console.log("otp: ", otp);
            const hashedPassword = await bcrypt.hash(otp, 10);
            const userData = await User.findOneAndUpdate({ email: email }, { password: hashedPassword }, { new: true });
            console.log("userData: ", userData);

            return userData;
        } catch (error) {
            console.error("forgotPassword error: ", error);
            throw error;
        }
    }

    // async isExistinPassword(email: string, password: string) {
    //   try {
    //       const user = await this.findUserByEmail(email);
    //       if (!user) {
    //           throw new HttpErrorUnauthorized("User not found", true, "not found");
    //       }
    //       const isPasswordMatch = await bcrypt.compare(user.password, password);
    //       if (!isPasswordMatch) {
    //           throw new HttpErrorUnauthorized("Invalid password", true, "unauthorized");
    //       }
    //       return true;
    //   } catch (error) {
    //       console.error("isExistinPassword error: ", error);
    //       throw error;
    //   }
    // }


}