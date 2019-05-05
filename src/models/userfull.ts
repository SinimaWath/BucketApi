import {IUserData, User} from './user';
import {AuthModel, IAuthData} from './auth';
import {TFieldError, TModelCreate} from './model';
import {AppContainer} from '../di/bootstrap';
import {ILogger} from '../utils/ILogger';
import {TYPES} from '../di/types';
import {resultify} from '../utils/action';

export type IUserFullData = IUserData & IAuthData;
export type TUserFullValidationError = TFieldError<IUserFullData> | null;
export type TCreateFullUser = TModelCreate<IUserFullData, IUserFullData>;


export async function createFullUser (data: IUserFullData): Promise<TCreateFullUser> {
    const [userModel, authModel] = await Promise.all([User.create(data), AuthModel.create(data)]);

    const logger = AppContainer.get<ILogger>(TYPES.Logger);
    logger.log(userModel, authModel);

    if (userModel.error) {
        return {errorField: userModel.errorField, error: userModel.error};
    }

    if (authModel.error) {
        return {errorField: authModel.errorField, error: authModel.error};
    }

    const full: IUserFullData = {
        ...data,
    };

    return resultify(full);
}
