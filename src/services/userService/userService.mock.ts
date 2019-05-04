import {injectable} from 'inversify';
import {IUserService, TCreateUser, TGetUser} from './interfaces';
import {IUser, User} from '../../models/user';
import {resultify} from '../../utils/service';
import {BaseUserService} from './userService';

@injectable()
export class MockUserService extends BaseUserService implements IUserService  {
    async get(id: string): Promise<TGetUser> {
        return await this._userStorage.findOneById(id);
    }

    async create(data: IUser): Promise<TCreateUser> {
        const user = User.create(data);

        const error = user.validate();
        if (error !== null) {
            return error;
        }

        const insertedUser = await this._userStorage.insert(user);
        this._logger.log(insertedUser);

        const jwt = await this._authService.create({email: insertedUser.email, _id: insertedUser._id});

        return resultify(jwt);
    }
}
