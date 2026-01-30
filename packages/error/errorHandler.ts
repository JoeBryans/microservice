import { Request, Response, NextFunction } from "express";
import { HttpError } from "./httpError";
export function ErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HttpError) {
        console.log("errHttp",err);
        
        return res.status(err.status).json({
            status: err.status,
            isOperational: err.isOperational,
            statusText: err.statusText,
            message: err.message,
            data: err.data ? err.data : {}
        });
    }

    return res.status(500).json({
        message: "Internal Server Error",
    });
}