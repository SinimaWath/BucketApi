import {IError} from '../utils/errors';
import {IResult} from '../utils/service';

export interface IModel<T> {
    validate (): T;
}

export enum EValidationError {
    NOT_EXIST = 'It\'s required',
}

/**
 * T - Интерфейс данных
 */
export type TValidationField<T> = keyof T;

/**
 * Тип ошибки для поля
 * T - интерфейс данных
 */
export type TFieldError<T> = IError<EValidationError> & {errorField: TValidationField<T>};

/**
 * T - Класс модели
 * Y - Интерфейс данных
 */
export type TModelCreate<T, Y> = Partial<IResult<T> & TFieldError<Y>>;

export function createNotExistErr<T> (errorField: TValidationField<T>): TFieldError<T> {
    return {errorField, error: EValidationError.NOT_EXIST};
}

export class Model<D, E> {
    constructor (private readonly requiredFields: TValidationField<D>[]) {}

    validate (): E | TFieldError<D> {
        const err = this.checkRequire();
        if (err !== null) {
            return err;
        }

        return null;
    }

    checkRequire (): TFieldError<D> {
        console.warn(this.requiredFields);
        for (let i = 0; i < this.requiredFields.length; i++) {
            // @ts-ignore
            if (!this[this.requiredFields[i]]) {
                return createNotExistErr(this.requiredFields[i]);
            }
        }

        return null;

    }
}
