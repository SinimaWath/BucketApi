import {
    BaseHttpController,
    controller,
    httpGet,
    httpPost,
    requestParam,
    results
} from 'inversify-express-utils';
import {inject} from 'inversify';
import {TYPES} from '../di/types';
import {IUserService, TCreateUser, TGetUser} from '../services/userService/interfaces';
import {ILogger} from '../utils/ILogger';
import {createError, createSimpleError, EErrors} from './errors';
import {errorify} from '../utils/service';

const userService = inject(TYPES.UserService);
const logger = inject(TYPES.Logger);

@controller('/users')
export class ProfileController extends BaseHttpController {
    @userService private readonly _userService: IUserService;
    @logger private readonly _logger: ILogger;

    /**
     * @api {get} /users/:id Тестовый конец - возвращает юзера по id
     * @apiGroup Users
     * @apiParam {id} id
     * @apiError (Error 404) {NotFound} error - на нашли юзера
     * @apiSuccessExample {json} Success
     *  {
     *      "email": "test@mail.ru",
     *      "password": "kek",
     *      "age": 20,
     *      "country": "Russia",
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAbWFpbC5ydSIsImlhdCI6MTU1NzAyMjAyNywiZXhwIjoxNTU3MDI1NjI3fQ.IuYGv5_9lM8XKX_y8Jp0bK0AM18P0xTDrNiCRnVmwW8",
     *      "_id": "0"
     *  }
     */
    @httpGet('/:id', TYPES.Morgan)
    public async get(@requestParam('id') id: string): Promise<results.JsonResult> {
        const {result, error}: TGetUser = await this._userService.get(id);

        this._logger.log(result, error);

        if (error === EErrors.NOT_FOUND || !result) {
            return this.json(createSimpleError(EErrors.NOT_FOUND), 404);
        }

        return this.json(result, 200);
    }


    /**
     * @api {post} /users Создание пользователя(Регистрация)
     * @apiGroup Users
     * @apiParam {String} email
     * @apiParam {String} password
     * @apiParam {Number} age
     * @apiParam {String} country
     * @apiParamExample {json} Input Пример запроса
     *  {
     *      "email": "test@mail.ru",
	 *      "password": "kek",
	 *      "age": 20,
	 *      "country": "Russia"
     *  }
     * @apiSuccess {Header} x-auth-token  Заголовок содержит JWT токен
     * @apiError (Error 400) {String} error  Описание ошибки
     * @apiError (Error 400) {String} data Содержит поле ошибки
     * @apiErrorExample {json} Error-Response
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "data": "email"
     *       "error": "It's required"
     *     }
     *
     * @apiError (500) {String} error Описание ошибки
     *
     */
    @httpPost('/', TYPES.Morgan)
    public async create(): Promise<results.JsonResult> {
        const {
            result = null,
            errorField = null,
            error = null,
        }: TCreateUser = await this._userService.create(this.httpContext.request.body);

        if (error && errorField) {
            return this.json(createError(error, errorField), 400);
        }

        if (error) {
            return this.json(createSimpleError(error), 500);
        }

        this.httpContext.response.setHeader('x-auth-token', result.jwt);

        return this.json('', 200);
    }
}
