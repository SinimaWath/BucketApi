import {
    IAuthService,
    IJWTData,
    TCheckAuthToken,
    TCheckCredentials,
    TCheckTokenTruth,
    TCreateAuthToken,
    TRemoveAuthToken
} from './interfaces';
import {inject, injectable} from 'inversify';
import {TYPES} from '../../di/types';
import {ILogger} from '../../utils/ILogger';
import {IJWT} from '../../utils/IJWT';
import {BaseAuthService} from './authServiceBase';
import {errorify, resultify} from '../../utils/service';
import {EAuthServiceError} from './errors';
import {TGetUser} from '../userService/interfaces';
import {EErrors} from '../../controllers/errors';
import {IUserStorage, TUserStorageGet, TUserStorageUpdate} from '../../storages/user/interfaces';
import {AuthModel, IAuthData, TCreateAuthModel} from '../../models/auth';

@injectable()
export class AuthService extends BaseAuthService implements IAuthService{
    @inject(TYPES.Logger) private readonly _logger: ILogger;
    @inject(TYPES.UserStorage) private readonly _storage: IUserStorage;

    public async create (authData: IAuthData): Promise<TCreateAuthToken> {
        const {
            result: authModel,
            error: authModelError,
            errorField: authModelErrorField,
        }: TCreateAuthModel = await AuthModel.create(authData);

        if (authModelError && authModelErrorField) {
            return {error: authModelError, errorField: authModelErrorField};
        }

        const {error: checkCredentialError}: TCheckCredentials = await this.checkCredentials(authData);
        if (checkCredentialError) {
            return errorify(checkCredentialError);
        }

        const {
            result: tokenResult,
            error: tokenError,
        }: TCreateAuthToken = await this.createToken({email: authModel.email});

        if (tokenError) {
            return errorify(EAuthServiceError.INVALID_TOKEN);
        }

        const {
            result: updateResult,
            error: updateError,
        }: TGetUser = await this._storage.updateByEmail(authModel.email, {
            token: tokenResult.jwt,
        });


        if (updateError) {
            return errorify(updateError);
        }

        if (!updateResult) {
            return errorify(EErrors.NOT_FOUND);
        }

        return resultify(tokenResult);
    }

    public checkAndDecode (token: IJWT): Promise<TCheckAuthToken> {
        return new Promise((resolve: any): void => (
            void this._jwt.verify(token.jwt, this._secretKey,
                (err: Error, encode: object) => {
                    if (err) {
                        return resolve(errorify(EAuthServiceError.INVALID_TOKEN));
                    }

                    this._logger.log(typeof encode);
                    resolve(resultify(encode));
                },
            )
        ));
    }

    public async createToken (authData: IJWTData): Promise<TCreateAuthToken> {
        return new Promise((resolve: any, reject: any): void => (
            void this._jwt.sign(authData, this._secretKey, {
                expiresIn: this._config.jwt.exp,
            }, (err: Error, encode: string) => {
                if (err) {
                    return reject(errorify(err));
                }

                resolve(resultify({jwt: encode}));
            })
        ));
    }

    async checkCredentials (authData: IAuthData): Promise<TCheckCredentials> {
        const {result, error}: TUserStorageGet = await this._storage.findOneByEmail(authData.email);
        if (error) {
            this._logger.log('CheckCredentials: ', error);

            return errorify(EAuthServiceError.INVALID_CREDENTIALS);
        }

        const isSame = AuthModel.checkPassword(authData.password, result.password);
        if (!isSame) {
            this._logger.log('CheckCredentials: passwords are different');

            return errorify(EAuthServiceError.INVALID_CREDENTIALS);
        }

        return {};
    }

    public async checkTokenTruth (jwtData: IJWTData & IJWT): Promise<TCheckTokenTruth> {
        const {result, error}: TUserStorageGet = await this._storage.findOneByEmail(jwtData.email);

        if (error) {
            this._logger.log('checkTokenTruth: ', error);

            return errorify(EAuthServiceError.INVALID_CREDENTIALS);
        }

        if (result.token !== jwtData.jwt) {
            this._logger.log('checkTokenTruth: token not same');

            return errorify(EAuthServiceError.INVALID_CREDENTIALS);
        }

        return {};
    }

    public async remove (jwt: IJWT): Promise<TRemoveAuthToken> {
        const {result, error = null}: TCheckAuthToken = await this.checkAndDecode(jwt);
        if (error) {
            return errorify(error);
        }

        const {error: updateError}: TUserStorageUpdate = await this._storage.updateByEmail(result.email, {
            token: '',
        });

        if (updateError) {
            return errorify(error);
        }

        return {};
    }
}
