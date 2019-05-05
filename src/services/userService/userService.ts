import {injectable} from 'inversify';
import {IUserService, TCreateUser, TGetUser, TGetUsers} from './interfaces';
import {IUser, IUserData, TCreateUserModel, User} from '../../models/user';
import {errorify, resultify} from '../../utils/service';
import {BaseUserService} from './userServiceBase';
import {TCreateAuthToken} from '../authService/interfaces';
import {AuthModel, IAuthData, TCreateAuthModel} from '../../models/auth';
import {createFullUser, TCreateFullUser} from '../../models/userfull';
import {TUserStorageInsert} from '../../storages/user/interfaces';

@injectable()
export class UserService extends BaseUserService implements IUserService  {
    async get(id: string): Promise<TGetUser> {
        return await this._userStorage.findOneById(id);
    }

    async create(data: IUserData & IAuthData): Promise<TCreateUser> {
        const {
            result: fullModel,
            error,
            errorField,
        }: TCreateFullUser = await createFullUser(data);

        if (error) {
            return {error, errorField};
        }

        this._logger.log(fullModel);

        const {
            result: tokenResult,
            error: tokenError,
        }: TCreateAuthToken = await this._authService.createToken({
            email: fullModel.email,
        });

        if (tokenError) {
            return errorify(tokenError);
        }

        fullModel.token = tokenResult.jwt;

        const {
            result: insertedResult,
            error: insertError,
        }: TUserStorageInsert = await this._userStorage.insert(fullModel);

        if (insertError) {
            return errorify(insertError);
        }

        this._logger.log(insertedResult);

        return resultify(tokenResult);
    }
}
