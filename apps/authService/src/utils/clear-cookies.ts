import { Response } from "express";

export const clearCookies = (res: Response) => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
};