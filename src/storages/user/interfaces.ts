import {IError} from '../../utils/errors';
import {TAction} from '../../utils/service';
import {IUserFullData} from '../../models/userfull';

export type IStorageError = IError<string>;

export type TUserStorageGet = TAction<IUserFullData, IStorageError>;
export type TUserStorageUpdate = TAction<IUserFullData, IError<string>>;
export type TUserStorageInsert = TAction<IUserFullData, IError<string>>;

export interface IUserStorage {
    findOneById (id: string): Promise<TUserStorageGet>;
    findOneByEmail (email: string): Promise<TUserStorageGet>;
    insert (model: IUserFullData): Promise<TUserStorageInsert>;
    updateByEmail (email: string, model: Partial<IUserFullData>): Promise<TUserStorageUpdate>;
}
