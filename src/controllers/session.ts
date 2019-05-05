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
import {IAuthService, TCreateAuthToken, TRemoveAuthToken} from '../services/authService/interfaces';
import {createError, EErrors} from './errors';
import {IAuthData} from '../models/auth';
import {EAuthServiceError} from '../services/authService/errors';
import {errorify} from '../utils/action';

@controller('/session')
export class SessionController extends BaseHttpController {
    @inject(TYPES.AuthService) private readonly _authService: IAuthService;

    /**
     * @api {post} /session Авторизоваться
     * @apiGroup Session
     * @apiDescription Всегда сбрасывает старый токен, если такой еще жив и создает новый.
     * Так что если прийти с другого клиента, то разлогинет везде. Может нужно переделать.
     * @apiHeader {String} x-auth-token Юникальный идентификатор юзера
     * @apiParam {String} email
     * @apiParam {String} password
     * @apiParamExample {json} Input Пример запроса
     *  {
     *      "email": "test@mail.ru",
     *      "password": "kek",
     *  }
     *
     * @apiSuccess {Header} x-auth-token Юникальный идентификатор юзера
     * @apiError (Error 409) {AlreadyAuthorized} error уже авторизован
     * @apiError (Error 404) {InvalidCredentials} error неправильные данные email/password
     * @apiError (Error 400) {String} error  Описание ошибки
     * @apiError (Error 400) {String} data   Содержит поле ошибки
     * @apiErrorExample {json} Error-Response
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "data": "email"
     *       "error": "It's required"
     *     }
     *
     */
    @httpPost('/', TYPES.Morgan)
    public async signIn (@requestBody() credentials: IAuthData) {
        if (this.httpContext.user && await this.httpContext.user.isAuthenticated()) {
            return this.json(errorify(EErrors.ALREADY_AUTH), 409);
        }

        const {result, error, errorField}: TCreateAuthToken = await this._authService.create(credentials);

        if (error) {
            if (errorField) {
                return this.json(createError(error, errorField), 400);
            }
            switch (error) {
                case EAuthServiceError.INVALID_CREDENTIALS:
                    return this.json(errorify(error), 404);
                default:
                    return this.json(errorify(error), 500);
            }
        }

        this.httpContext.response.setHeader('x-auth-token', result.jwt);

        return this.json('', 200);
    }

    /**
     * @api {delete} /session  Удалить сессию
     * @apiGroup Session
     * @apiHeader {String} x-auth-token Юникальный идентификатор юзера
     * @apiError (Error 401) {Unauthorized} error
     * @apiErrorExample {json} Unauthorized
     * HTTP/1.1 401 Unauthorized
     * {
     *     "error": "Unauthorized"
     * }
     * @apiError (Error 400) {String} error  Корявый JWT пришел
     * @apiErrorExample {json} Bad request
     * HTTP/1.1 400 Bad Request
     * {
     *      "error": "Разьебало бэк"
     * }
     *
     */
    @httpDelete('/', TYPES.Morgan)
    public async logout (@requestHeaders('x-auth-token') token: string) {
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

    /**
     * @api {get} /session Проверить сессию
     * @apiGroup Session
     * @apiHeader {String} x-auth-token Юникальный идентификатор юзера
     * @apiError (Error 401) {Unauthorized} error
     * @apiErrorExample (Error 401) {json} Unauthorized
     * HTTP/1.1 401 Unauthorized
     * {
     *     "error": "Unauthorized"
     * }
     * @apiError (Error 500) {String} error
     * @apiErrorExample (Error 500) {json} Internal Server Error
     * HTTP/1.1 500 Internal Server Error
     * {
     *     "error": "Разьебало"
     * }
     * @apiSuccessExample
     *      HTTP/1.1 200 OK
     */
    @httpGet('/')
    public async check () {
        if (this.httpContext.user && !await this.httpContext.user.isAuthenticated()) {
            return this.json(errorify(EErrors.UNAUTHORIZED), 401);
        }

        return this.json('', 200);
    }
}
