export interface IError {
    error?: string;
    data?: any;
}
export function createSimpleError(error: string): IError {
    return {
        error,
    };
}
