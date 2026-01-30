import { Request, Response } from "express";
import UserProfile from "../models/user";
import { asyncHandler } from "../utils/asyncHandler";
import UserService from "../service/user.service";
 const userService=new UserService
export const UserController = {

    create: asyncHandler(async (req: Request, res: Response) => {
        try {

            const internalKey = req.headers["x-internal-key"];

            console.log(internalKey);


            if (internalKey !== process.env.INTERNAL_SERVICE_KEY) {
                throw new Error("Invalid internal key");
            }

            console.log(req.body);
            
            const { userId, email, name, role } = req.body;

            if (!userId || !email || !name) {
                const isMissingField = Object.keys(req.body).filter((key) => !req.body[key]);
                throw new Error(`Missing fields: ${isMissingField.join(", ")}`);
            }


            const exist = await UserProfile.findById(req.body.userId);
            if (exist) {
                throw new Error("User already exists");
            }

            const user = await UserProfile.create({
                userId,
                email,
                name,
                role: role ? role : "USER",
                isActive: true,
            });
          if(user.role==="SELLER"){
              await userService.emitEvent(user);
          }

            res.status(201).json({ message: "User created successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }),

    profile:asyncHandler(
        async(req:Request,res:Response)=>{
         const id= req.params.id

         return res.status(200).json(await userService.profile(id))
        }
    )
}