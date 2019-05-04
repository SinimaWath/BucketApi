import {IUser, User} from '../../models/user';
import {IError} from '../../utils/errors';
import {IResult} from '../../utils/service';

export type IStorageError = IError<string>;
export type TUserStorageGet = Partial<IResult<IUser> & IStorageError>;

export interface IUserStorage {
    findOneById(id: string): Promise<TUserStorageGet>;
    insert(model: User): Promise<IUser>;
}
