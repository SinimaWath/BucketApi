import {
    BaseHttpController,
    controller,
    httpDelete,
    httpGet,
    httpPost,
    requestBody,
    requestHeaders
} from 'inversify-express-utils';
import {inject} from 'inversify';
import {TYPES} from '../di/types';
import {IAuthService, TCheckAuthToken, TCreateAuthToken, TRemoveAuthToken} from '../services/authService/interfaces';
import {errorify} from '../utils/service';
import {EErrors} from './errors';
import {IAuthData} from '../models/auth';
import {EAuthServiceError} from '../services/authService/errors';

@controller('/session')
export class SessionController extends BaseHttpController {
    @inject(TYPES.AuthService) private readonly _authService: IAuthService;

    @httpPost('/', TYPES.Morgan)
    public async signIn(@requestBody() credentials: IAuthData) {
        if (this.httpContext.user && await this.httpContext.user.isAuthenticated()) {
            return this.json(errorify(EErrors.ALREADY_AUTH), 409);
        }

        const {result, error}: TCreateAuthToken = await this._authService.create(credentials);

        if (error) {
            switch (error) {
                case EAuthServiceError.INVALID_CREDENTIALS:
                    return this.json(errorify(error), 404);
                default:
                    return this.json(errorify(error), 400);
            }
        }

        this.httpContext.response.setHeader('x-auth-token', result.jwt);

        return this.json('', 200);
    }

    @httpDelete('/', TYPES.Morgan)
    public async logout(@requestHeaders('x-auth-token') token: string) {
        if (this.httpContext.user && !await this.httpContext.user.isAuthenticated()) {
            return this.json(errorify(EErrors.UNAUTHORIZED), 401);
        }

        const {error}: TRemoveAuthToken = await this._authService.remove({jwt: token});
        if (error) {
            switch (error) {
                default:
                    return this.json(errorify(error), 400);
            }
        }

        return this.json('', 200);
    }

    @httpGet('/')
    public async check(@requestHeaders('x-auth-token') token: string) {
        const {error}: TCheckAuthToken = await this._authService.checkAndDecode({jwt: token});
        if (error) {
            return this.json(errorify(EErrors.UNAUTHORIZED), 401);
        }

        return this.json('', 200);
    }
}
