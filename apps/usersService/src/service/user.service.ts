import UserProfile, { UserInterface } from "../models/user";
export default class UserService {
    constroctor() { }
     async handleCreate(userData:UserInterface) {
        console.log(userData);
        
            try {

                const { _id, email, name, role, phone, verified } = userData ;

                if (!_id || !email || !name) {
                   
                    throw new Error(`all fields are required`);
                }
    
    
                const exist = await UserProfile.findById(userData.userId);
                if (exist) {
                    throw new Error("User already exists");
                }
    
                const user = await UserProfile.create({
                    userId: _id,
                    email,
                    name,
                    phone,
                    verified: verified,
                    role: role ? role : "USER",
                    isActive: true,
                }) as any;
    
                console.log(user);
                
               
                return user;
            } catch (error) {
                console.error(error);
               return{ message: "Internal server error: ",error};
            }
        }
    

    async profile(id: string) {
        try {
            const user = await UserProfile.findOne({
                userId: id
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



}
