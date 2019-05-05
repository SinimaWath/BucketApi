import {IJWT} from '../../utils/IJWT';
import {IError, TAction} from '../../utils/action';
import {IAuthData, TAuthValidationError} from '../../models/auth';

export interface IJWTData {
    email: string;
}

export type TCheckCredentials = TAction<{}, IError<string>>;
export type TCheckTokenTruth = TAction<{}, IError<string>>;
export type TCreateAuthToken = TAction<IJWT, TAuthValidationError>;
export type TCheckAuthToken = TAction<IJWTData, IError<string>>;
export type TRemoveAuthToken = TAction<IJWT, IError<string>>;

export interface IAuthService {

    /**
     * Создает сессию
     * @param authData
     */
    create (authData: IAuthData): Promise<TCreateAuthToken>;

    /**
     * Создает Токен сессии
     * @param jwtData
     */
    createToken (jwtData: IJWTData): Promise<TCreateAuthToken>;

    /**
     * Проверяет авторизационные данные
     * @param authData
     */
    checkCredentials (authData: IAuthData): Promise<TCheckCredentials>;


    /**
     * Проверяет токен на валидность
     * @param jwt
     */
    checkAndDecode (jwt: IJWT): Promise<TCheckAuthToken>;


    /**
     * Проверяем настоящий ли это токен пользователя или нет
     * @param jwtData
     */
    checkTokenTruth (jwtData: IJWTData & IJWT): Promise<TCheckTokenTruth>;


    /**
     * Удаляет сессию
     * @param jwt
     */
    remove (jwt: IJWT): Promise<TRemoveAuthToken>;
}
