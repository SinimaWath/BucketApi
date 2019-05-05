import {injectable} from 'inversify';
import {IUserService, TCreateUser, TGetUser} from './interfaces';
import {IUserData} from '../../models/user';
import {BaseUserService} from './userServiceBase';
import {IAuthData} from '../../models/auth';

@injectable()
export class MockUserService extends BaseUserService implements IUserService  {
    create (user: IUserData & IAuthData): Promise<TCreateUser> {
        return undefined;
    }

    get (id: string): Promise<TGetUser> {
        return undefined;
    }

}
