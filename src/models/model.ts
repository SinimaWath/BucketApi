import {IError} from '../utils/errors';
import {IResult} from '../utils/service';
import {inject, injectable} from 'inversify';
import {TYPES} from '../di/types';
import {IConfig} from '../config/config';

export interface IModel<T> {
    validate(): T;
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

export function createNotExistErr<T>(errorField: TValidationField<T>): TFieldError<T> {
    return {errorField, error: EValidationError.NOT_EXIST};
}

