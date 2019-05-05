import {IUser, IUserData} from '../../models/user';
import {IError} from '../../utils/errors';
import {IJWT} from '../../utils/IJWT';
import {IResult, TAction} from '../../utils/service';
import {IAuthData} from '../../models/auth';
import {IUserFullData, TUserFullValidationError} from '../../models/userfull';

export type TGetUser = TAction<IUserFullData, IError<string>>;
export type TGetUsers = Partial<IResult<IUser[]> & IError<string>>;
export type TCreateUserError = Partial<TUserFullValidationError>;

export type TCreateUser = TAction<IJWT, TCreateUserError>;

export interface IUserService {
    get (id: string): Promise<TGetUser>;
    create (user: IUserData & IAuthData): Promise<TCreateUser>;
}

