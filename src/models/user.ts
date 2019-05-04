import {IError} from '../utils/errors';

export interface IUser {
    readonly email: string;
    readonly password: string;
    readonly age: number;
    readonly country: string;
    _id?: string;
}

export interface IUserValidationError extends IError<EValidationError>{
    errorField: TErrorField;
}

export enum EValidationError {
    NOT_EXIST = 'It\'s required',
}

export type TErrorField = keyof IUser;

function createNotExistErr(errorField: TErrorField): IUserValidationError  {
    return {errorField, error: EValidationError.NOT_EXIST};
}

export class User implements IUser{

    constructor(
        public readonly age: number,
        public readonly country: string,
        public readonly password: string,
        public readonly email: string,
        public _id?: string,

    ) {}

    public static create(user: IUser): User {
        return new User(user.age, user.country, user.password, user.email, user._id);
    }

    validate(): IUserValidationError | null {
        const err = this.checkRequire();
        if (err !== null) {
            return err;
        }

        return null;
    }

    checkRequire(): IUserValidationError | null {
        if (!this.email) {
            return createNotExistErr('email')
        }

        if (!this.password) {
            return createNotExistErr('password');
        }

        if (!this.age) {
            return createNotExistErr('age')
        }

        if (!this.country) {
            return createNotExistErr('country')
        }

        return null;

    }
}
