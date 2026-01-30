import jwt from "jsonwebtoken";


export const createRefreshToken = (user: any) => {
    console.log("createRefreshToken: ", user);
    
    const payload = {
        sub: user._id||user.sub,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        verified: user.verified

    }

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
        expiresIn: "7d",
    })
    // console.log("token:", refreshToken);

    return refreshToken
}