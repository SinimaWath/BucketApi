import {IError} from '../utils/errors';

export interface IErrorResponse extends IError<string>{
    data?: any;
}

export function createSimpleError(error: string): IErrorResponse {
    return {
        error,
    };
}

export function createError(error: string, data: any): IErrorResponse {
    return {
        data,
        error,
    };
}


export enum EErrors {
    NOT_FOUND = 'User not found',
    INTERNAL = 'Internal server error',
    UNAUTHORIZED = 'Unauthorized',
    ALREADY_AUTH = 'Already authorized',
}
