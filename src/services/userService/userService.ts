import {inject, injectable} from 'inversify';
import {TYPES} from '../../contsants/types';
import {IAuthService} from '../authService/interfaces';
import {IUserStorage} from '../../storages/user/interfaces';
import {ILogger} from '../../utils/ILogger';

@injectable()
export abstract class BaseUserService{
    @inject(TYPES.AuthService) protected readonly _authService: IAuthService;
    @inject(TYPES.UserStorage) protected readonly _userStorage: IUserStorage;
    @inject(TYPES.Logger) protected readonly _logger: ILogger;
}
