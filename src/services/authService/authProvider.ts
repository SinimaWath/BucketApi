import {interfaces} from 'inversify-express-utils';
import express from 'express';
import {inject, injectable} from 'inversify';
import {TYPES} from '../../di/types';
import {IAuthService, TCheckAuthToken, TCheckTokenTruth} from './interfaces';
import {AuthPrincipal} from './authPrincipal';
import {errorify} from '../../utils/service';
import {EAuthServiceError} from './errors';
import AuthProvider = interfaces.AuthProvider;

export interface IAuthProviderConstructor {
    new (): AuthProvider;
}

@injectable()
export class UserAuthProvider implements interfaces.AuthProvider {
    @inject(TYPES.AuthService) protected readonly _authService: IAuthService;

    public async getUser (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ): Promise<interfaces.Principal> {
        const token = req.headers['x-auth-token'];
        if (!token) {
            return new AuthPrincipal(null, errorify(EAuthServiceError.NO_TOKEN));
        }

        const {result, error = null}: TCheckAuthToken = await this._authService.checkAndDecode({jwt: token as string});
        if (error) {
            return new AuthPrincipal(result, errorify(error));
        }

        const {error: checkError = null}: TCheckTokenTruth = await this._authService.checkTokenTruth({
            email: result.email,
            jwt: token as string,
        });

        if (checkError) {
            return new AuthPrincipal(result, errorify(checkError));
        }

        return new AuthPrincipal(result, null);
    }
}
