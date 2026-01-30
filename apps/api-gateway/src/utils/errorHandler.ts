export class ApiError extends Error {
    status: number;
    message: string;
    isOperational: boolean;
    constructor(status: number, message: string, isOperational: boolean = true) {

        super(message);
        this.status = status;
        this.message = message;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, ApiError);
    }
}