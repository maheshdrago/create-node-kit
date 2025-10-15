import { ErrorCode } from "../types";
export class HttpException extends Error{

    error_code: ErrorCode;
    error_message: string;
    delta: any;

    constructor(error_code: ErrorCode, error_message:string, delta: any){
        super(error_message)

        this.delta = delta
        this.error_code = error_code
        this.error_message = error_message

    }
}