import UserProfile from "../models/user";
import axios from "axios";
export default class UserService   { 
    constroctor(){}
    async profile(id:string){
        try {
            const user = await UserProfile.findOne({
                userId:id
            })
        if (!user) {
           throw new Error("user not found")  
        }

        return user 
        } catch (error) {
             console.log(error);
             return error
             
        }
    }
    async emitEvent(userData:any) {
        console.log("userData: ", userData);
        
        try {
              const create = await axios.post("http://localhost:4006/api/seller/create",
                                 {
                                     userId: userData._id,
                                     role: userData.role
                                 },
                                 {
                                     headers: {
                                         "x-internal-key": process.env.INTERNAL_SERVICE_KEY!,
                                     },
                                     timeout: 3000,
                                 }
                             );
        } catch (error) {
          console.log(error);
          return error;
             
        }
    }


   }
