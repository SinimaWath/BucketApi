import {IModel, Model, TFieldError, TModelCreate} from './model';
import {resultify} from '../utils/action';

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

export class User extends Model<IUserData, null> implements IUser{

    constructor (
        public readonly age: number,
        public readonly country: string,
        public _id?: string,
    ) {
        super(['age', 'country']);
    }

    public static async create (user: IUserData): Promise<TCreateUserModel> {
        let created = new User(user.age, user.country, user._id);

        const error = created.validate();
        if (error !== null) {
            return error;
        }

        return resultify(created);
    }
}
