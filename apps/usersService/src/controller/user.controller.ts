import { Request, Response } from "express";
import UserProfile, { UserInterface } from "../models/user";
import { asyncHandler } from "../utils/asyncHandler";
import UserService from "../service/user.service";
const userService = new UserService
export const UserController = {

   
    profile: asyncHandler(
        async (req: Request, res: Response) => {
            const id = req.params.id

            return res.status(200).json(await userService.profile(id))
        }
    )
}