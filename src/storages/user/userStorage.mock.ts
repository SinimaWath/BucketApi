import {IStorageError, IUserStorage, TUserStorageGet} from './interfaces';
import {User} from '../../models/user';
import {injectable} from 'inversify';
import {EErrors} from '../../controllers/errors';
import {errorify, resultify} from '../../utils/service';


let storage: Array<User> = [];

@injectable()
export class MockUserStorage implements IUserStorage {
    findOneById(id: string): Promise<TUserStorageGet> {
        const user = storage[parseInt(id, 10) - 1];

        if (!user) {
            return Promise.resolve(errorify(EErrors.NOT_FOUND));
        }

        return Promise.resolve(resultify(user));
    }

    insert(model: User): Promise<User> {
        const id = storage.push(model);
        model._id = id.toString();

        return Promise.resolve(model);
    }

}
