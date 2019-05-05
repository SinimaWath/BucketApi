import {IModel, Model, TFieldError, TModelCreate} from './model';
import bcrypt from 'bcrypt';
import {TYPES} from '../di/types';
import {IConfig} from '../config/config';
import {AppContainer} from '../di/bootstrap';
import {errorify, resultify} from '../utils/action';

export interface IAuthData {
    email: string;
    password: string;
    token?: string;
}

export interface IAuthModel extends IAuthData, IModel<TAuthValidationError> {
}

export type TAuthValidationError = TFieldError<IAuthData> | null;

export type TCreateAuthModel = TModelCreate<AuthModel, IAuthData>;

export class AuthModel extends Model<IAuthData, null> implements IAuthModel {
    constructor (
        public email: string,
        public password: string,
        public token: string,
    ) {
        super(['email', 'password']);
    }

    public static checkPassword (toCompare: string, encrypted: string): Promise<boolean> {
        return bcrypt.compare(toCompare, encrypted);
    }

    public static async create (data: IAuthData): Promise<TCreateAuthModel> {
        let created = new AuthModel(data.email, data.password, data.token);

        const error = created.validate();
        if (error) {
            return error;
        }

        try {
            const passwordHashRound = AppContainer.get<IConfig>(TYPES.Config).passwordHashRound;
            await created.createHashPassword(passwordHashRound);
        } catch (e) {
            return errorify(e);
        }

        return resultify(created);
    }

    async createHashPassword (passwordHashRound: number) {
        this.password = await bcrypt.hash(this.password, passwordHashRound);
    }

}
