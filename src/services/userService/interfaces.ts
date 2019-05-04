import {IUser, IUserValidationError, TErrorField, User} from '../../models/user';
import {IError} from '../../utils/errors';
import {IJWT} from '../../utils/IJWT';
import {IResult} from '../../utils/service';

export type TGetUser = Partial<IResult<IUser> & IError<string>>;

export type TCreateUserError = IError<string> & IUserValidationError;

export type TCreateUser = Partial<IResult<IJWT> & TCreateUserError>;

export interface IUserService {
    get(id: string): Promise<TGetUser>;
    create(user: IUser): Promise<TCreateUser>;
}
