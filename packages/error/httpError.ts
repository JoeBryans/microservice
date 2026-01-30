export class HttpError extends Error {
    status: number;
    data: Record<string, any> = {};
    isOperational: boolean = false;
    statusText: string | null;


    constructor(
        status: number,
        message: string,
        isOperational: boolean,
        stack?: string,
        statusTexts?: string,
        data?: Record<string, any>,
    ) {
        super(message);
        this.status = status;
        this.isOperational = isOperational;
        this.stack=stack

        if (statusTexts) {
            this.statusText = statusTexts;
        }

        if (data) {
            this.data = data;
        }


        Error.captureStackTrace(this, this.constructor);

    }
}

export class HttpErrorNotFound extends HttpError {
    constructor(message: string, isOperational=true, statusText?: string){
        super(404, message, isOperational,statusText);
    }
}

export class HttpErrorBadRequest extends HttpError {
    constructor(message: string, isOperational = true, stack?:string, statusText?: string, data?: any) { 
        super(400, message, isOperational, stack!, statusText, data);
    }
}

export class HttpErrorUnauthorized extends HttpError {
    constructor(message: string, isOperational = true, stack: string, statusText?: string, data?: any) { 
        super(401, message, isOperational, stack, statusText, data);
    }
}

export class HttpErrorForbidden extends HttpError {
    constructor(message: string, stack?: string, data?: any) {
        super(403, message,true, stack!,  data);
    }
}
export class HttpErrorNotAllowed extends HttpError {
    constructor(message: string, data?: any) {
        super(405, message,true, data);
    }
}
export class HttpErrorInternalServerError extends HttpError {
    constructor(message: string,isOperational=true, stack?: string, data?: any) {
        super(500, message, isOperational, stack!, data);
    }
}
