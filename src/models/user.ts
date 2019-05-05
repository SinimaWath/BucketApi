import {resultify} from '../utils/service';
import {createNotExistErr, IModel, TFieldError, TModelCreate} from './model';

export interface IUserData {
    age: number;
    country: string;
    _id?: string;
}

export interface IUser extends IUserData, IModel<TUserValidationError> {
}

export type TCreateUserModel = TModelCreate<User, IUserData>;

export type TUserErrorField = TFieldError<IUserData>;

export type TUserValidationError = TUserErrorField | null;

export class User implements IUser{

    constructor(
        public readonly age: number,
        public readonly country: string,
        public _id?: string,
    ) {}

    public static async create(user: IUserData): Promise<TCreateUserModel> {
        let created = new User(user.age, user.country, user._id);

        const error = created.validate();
        if (error !== null) {
            return error;
        }

        return resultify(created);
    }

    validate(): TUserValidationError {
        const err = this.checkRequire();
        if (err !== null) {
            return err;
        }

        return null;
    }

    checkRequire(): TUserValidationError {
        if (!this.age) {
            return createNotExistErr('age')
        }

        if (!this.country) {
            return createNotExistErr('country')
        }

        return null;

    }
}
