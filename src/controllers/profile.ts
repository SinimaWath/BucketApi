import {
    BaseHttpController,
    controller,
    httpGet,
    httpPost,
    queryParam,
    requestParam,
    results
} from 'inversify-express-utils';
import {inject} from 'inversify';
import {TYPES} from '../contsants/types';
import {IUser, IUserService} from '../services/userService/interfaces';
import {createSimpleError} from '../utils/errors';
import {ILogger} from '../utils/ILogger';

enum EUserError {
    NOT_FOUND = 'User not found',
}

const userService = inject(TYPES.UserService);
const logger = inject(TYPES.Logger);

@controller('/user')
export class ProfileController extends BaseHttpController {
    @userService private readonly _userService: IUserService;
    @logger private readonly _logger: ILogger;

    @httpGet('/:id', TYPES.Morgan)
    public async get(@requestParam('id') id: string): Promise<results.JsonResult> {
        const user: IUser = await this._userService.get(id);
        this._logger.log(user);

        if (!user) {
            return this.json(createSimpleError(EUserError.NOT_FOUND), 404);
        }

        return this.json(user, 200);
    }
}
