export function resultify<T>(result: T) {
    return {result};
}

export function errorify<T>(error: T) {
    return {error};
}

export interface IResult<T> {
    result: T;
}
