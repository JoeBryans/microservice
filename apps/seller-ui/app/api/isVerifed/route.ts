import Jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  try {

      const Secret =process.env.ACCESS_TOKEN_SECRET
      const cookieStorage = await cookies()
      const email_verified = cookieStorage.get("email_verified");
      const value = email_verified?.value!;
      console.log("email_verified: ", value);

      const decodedToken = Jwt.verify(value, Secret) as any;
      console.log("decodedToken: ", decodedToken);


      if (decodedToken) {
          const { email, isVerified } = decodedToken;
          console.log("email: ", email);
          return NextResponse.json({ isVerified: isVerified, email: email }, {

          });
      }
  } catch (error) {
      console.error("isVerifed error: ", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
