import express from "express";

import { AuthController } from "../controllers/auth.controller";

const authRouter = express.Router();


authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.post("/otp-resend", AuthController.OtpResend);
authRouter.get("/refresh_token", AuthController.refreshToken);
authRouter.post("/reset-password", AuthController.resetPassword);
authRouter.post("/forgot-password", AuthController.forgotPassword);
authRouter.post("/verify-otp", AuthController.verifyOtp);
authRouter.post("/verify-email", AuthController.verifyEmail);
authRouter.post("/check-email", AuthController.checkEmail);

export default authRouter;