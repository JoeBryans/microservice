import express from "express";
import { UserController } from "../controller/user.controller";

const userRouter = express.Router();


userRouter.post("/emitEvent", UserController.create);
userRouter.get("/profile/:id", UserController.profile);

export default userRouter;