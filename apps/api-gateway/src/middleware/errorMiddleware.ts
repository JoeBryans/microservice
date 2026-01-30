import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/errorHandler";

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err);

    if (err instanceof ApiError) {
        res.status(err.status).json({
            status: err.status,
            message: err.message,
        });
        return;
    }

    res.status(500).json({
        status: 500,
        message: err.message,
    });
};