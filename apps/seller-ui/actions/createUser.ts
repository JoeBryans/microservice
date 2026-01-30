"use server";
import axios from "axios"
import { cookies } from "next/headers";
import { toast } from "sonner";
import Jwt from "jsonwebtoken";
export interface CreateUserInput {
    name: string,
    email: string,
    phone: string,
    password: string,
    role?: string
    verified?: boolean
    userId?: string
    isActive?: boolean
    createdAt?: Date
    updatedAt?: Date
    _id?: string
    id?: string
}
export interface CreateUserInputResponse {
    message: string;
    user: CreateUserInput

}




const url_endpoint = `${process.env.NEXT_PUBLIC_API_URL}`;
export async function createUserAction(data: CreateUserInput): Promise<CreateUserInputResponse> {

     console.log("data: ", data);
    try {
        const response = await fetch(`${url_endpoint}/v1/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include",
        });
        console.log("res: ", await response);

        const responseData = await response.json();
        
        return responseData;
    } catch (error: any) {
        console.log("error: ", error);
        throw error;
    }
}


export const authUser = async () => {
    const cookieStorage = await cookies()
    const accessToken = cookieStorage.get("access_token")?.value;
    console.log("accessToken: ", accessToken);
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!
    const decodedToken = Jwt.verify(accessToken!, ACCESS_TOKEN_SECRET,
        {
            ignoreExpiration: true,
        }
    ) as any;
    console.log("decodedToken: ", decodedToken);
    if (decodedToken) {
        const { sub, name, email, role, phone, verified } = decodedToken;
        console.log("email: ", email);
        return {
            id: sub,
            name,
            phone,
            email,
            role,
            verified
        };
    }
    return null;
}

export const getUserInfo = async (userId: string) => {
    const cookieStorage = await cookies()

    // console.log(cookieStorage);
    const accessToken = cookieStorage.get("access_token");
    const refreshToken = cookieStorage.get("refresh_token");

    console.log("accessToken:", accessToken?.value);

    try {
        const fetchUser = async () => {
            const res = await fetch(`${url_endpoint}/v1/seller/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken?.value}`,
                },
                credentials: "include", // include cookies automatically
            });
            console.log("fetch:", res);

            const data = await res.json();
            return { res, data };
        };

        const data = await fetchUser();
        return data.data;
    } catch (error) {
        console.error("getUserInfo error:", error);
        throw error;
    }
};
