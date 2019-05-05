export function resultify<T> (result: T): IResult<T> {
    return {result};
}

export function errorify<T> (error: T): IError<T> {
    return {error};
}

export interface IResult<T> {
    result: T;
}

export interface IError<T> {
    error: T | string;
}


export type TAction<R, E> = Partial<IResult<R> & E>;
