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

    @httpGet('/:id', TYPES.Morgan)
    public async get(@requestParam('id') id: string): Promise<results.JsonResult> {
        if (!await this.httpContext.user.isAuthenticated()) {
            return this.json(errorify(EErrors.UNAUTHORIZED), 400);
        }

        const {result, error}: TGetUser = await this._userService.get(id);

        this._logger.log(result, error);

        if (error === EErrors.NOT_FOUND || !result) {
            return this.json(createSimpleError(EErrors.NOT_FOUND), 404);
        }

        return this.json(result, 200);
    }


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

        return this.json(result, 200);
    }
}
