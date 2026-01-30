
import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { HttpErrorBadRequest, HttpErrorUnauthorized } from "@repose/error";
import { asyncHandler } from "../utils/asyncHandler";
import { setCookies } from "../utils/set-cookies";
import User from "../models/user";
import { PublishEvent } from "../utils/producer";


const authService = new AuthService();


const isProduction = process.env.NODE_ENV === "production"
export const AuthController = {


  register: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      console.log("req.body: ", req.body);

      if (!name || !email || !password) {
        throw new HttpErrorBadRequest("Please provide all required fields");
      }

      // Register user
      const { user, token } = await authService.register(req.body, next);

      // Emit event (e.g. to user-service / seller-service)
      await authService.emitEvent(user);

      const isProduction = process.env.NODE_ENV === "production"
      console.log("token: ", token);
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 1000 * 60 * 15,

      }).status(201).json({
        message: "User registered successfully",
        user: user,
      });
    } catch (error) {
      // Rollback if user was created but event emission failed
      if ((error as any)?.code === "EVENT_EMIT_FAILED" && (error as any)?.userId) {
        await User.findByIdAndDelete((error as any).userId);
      }

      next(error);
    }
  }),

  checkEmail: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) {
      throw new HttpErrorBadRequest("Please provide all the fields");
    }
    const result = await authService.checkEmail(email, next);
    console.log("res", result);


    res.cookie("email_ref", result, {
      httpOnly: true,
      secure: isProduction ? true : false,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 5,

    }).status(200).json(result);
  }),

  verifyEmail: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const cookie = req.cookies
    console.log("cookie: ", cookie);
    const token = cookie.email_ref;
    // console.log("req: ", req);
    console.log("token: ", token);

    const { otp } = req.body;
    console.log("otp: ", otp);
    if (!token || !otp) {
      throw new HttpErrorBadRequest("Please provide all the fields");
    }

    const result = await authService.verifyEmail(token, otp, next);
    console.log("result: ", result);
    res.cookie(
      "email_verified",
      result,
      {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 1000 * 60 * 15,
      }

    ).status(200).json("EMAIL_VERIFIED")
  }),

  verifyOtp: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new HttpErrorBadRequest("Please provide all the fields");
    }

    const result = await authService.VerifyOtp(email, otp, next);
    console.log("result: ", result);


    res.status(200).json({ message: "otp verified" });
  }
  ),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log("req.body :", req.body);
    if (!email || !password) {
      throw new HttpErrorBadRequest("Please provide all the fields");
    }

    const result = await authService.login(req.body, res);

    setCookies(res, result.refreshToken);
    console.log("🚨 SET-COOKIE HEADERS:", res.getHeaders());
    const user = result.user
    const accessToken = result.accessToken

    const response = {
      id: user._id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: user.role,
      accessToken: accessToken,
    }

    console.log("response:", response);


    return res.status(200).json(response);
  }),

  refreshToken: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refresh_token;
    console.log("refreshToken: ", refreshToken);
    if (!refreshToken) {
      throw new HttpErrorUnauthorized("Refresh token not found", true, "unauthorized");
    }
    const result = await authService.refreshToken(refreshToken, next);
    setCookies(res, result.newRefreshToken);
    const user = result.decode

    const response = {
      id: user.sub as string,
      email: user.email as string,
      phone: user.phone as string,
      name: user.name as string,
      role: user.role as string,
      accessToken: result.newAccessToken as string,
    }

    return res.status(200).json(response);
  }),

  OtpResend: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) {
      throw new HttpErrorBadRequest("Please provide all the fields");
    }
    const result = await authService.OtpResend(email, next);
    return res.status(200).json(result);
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, newPassword } = req.body;
    if (!email || !password || !newPassword) {
      throw new HttpErrorBadRequest("Please provide all the fields");
    }
    const result = await authService.resetPassword(email, password, newPassword, next);
    return res.status(200).json(result);
  }),

  forgotPassword: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) {
      throw new HttpErrorBadRequest("Please provide all the fields");
    }
    const result = await authService.forgotPassword(email, next);
    return res.status(200).json(result);
  }),

}