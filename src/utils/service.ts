import {IError} from './errors';

export function resultify<T>(result: T): IResult<T> {
    return {result};
}

export function errorify<T>(error: T): IError<T> {
    return {error};
}

export interface IResult<T> {
    result: T;
}

export type TAction<R, E> = Partial<IResult<R> & E>
