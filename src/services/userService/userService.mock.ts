import {injectable} from 'inversify';
import {IUserService, TCreateUser, TGetUser, TGetUsers} from './interfaces';
import {IUser, IUserData, TCreateUserModel, User} from '../../models/user';
import {BaseUserService} from './userServiceBase';
import {TCreateAuthToken} from '../authService/interfaces';
import {AuthModel, IAuthData, TCreateAuthModel} from '../../models/auth';

@injectable()
export class MockUserService extends BaseUserService implements IUserService  {
    create(user: IUserData & IAuthData): Promise<TCreateUser> {
        return undefined;
    }

    get(id: string): Promise<TGetUser> {
        return undefined;
    }

}
