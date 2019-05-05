import {createNotExistErr, IModel, TFieldError, TModelCreate} from './model';
import bcrypt from 'bcrypt';
import {errorify, resultify} from '../utils/service';
import {TYPES} from '../di/types';
import {IConfig} from '../config/config';
import {AppContainer} from '../di/bootstrap';

export interface IAuthData {
    email?: string;
    password?: string;
    token?: string;
}

export interface IAuthModel extends IAuthData, IModel<TAuthValidationError> {
}

export type TAuthValidationError = TFieldError<IAuthData> | null;

export type TCreateAuthModel = TModelCreate<AuthModel, IAuthData>;

export class AuthModel implements IAuthModel {
    constructor(
        public email: string,
        public password: string,
        public token: string,
    ) {}

    public static checkPassword(toCompare: string, encrypted: string): Promise<boolean> {
        return bcrypt.compare(toCompare, encrypted);
    }

    public static async create(data: IAuthData): Promise<TCreateAuthModel> {
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

    validate(): TAuthValidationError {
        const err = this.checkRequire();
        if (err !== null) {
            return err;
        }

        return null;
    }

    checkRequire(): TAuthValidationError {
        if (!this.email) {
            return createNotExistErr('email')
        }

        if (!this.password) {
            return createNotExistErr('password')
        }

        return null;

    }

    async createHashPassword(passwordHashRound: number) {
        this.password = await bcrypt.hash(this.password, passwordHashRound);
    }

}
