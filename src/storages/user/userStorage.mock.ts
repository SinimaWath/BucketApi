import {IStorageError, IUserStorage, TUserStorageGet, TUserStorageInsert, TUserStorageUpdate} from './interfaces';
import {inject, injectable} from 'inversify';
import {EErrors} from '../../controllers/errors';
import {errorify, resultify} from '../../utils/service';
import {IUserFullData} from '../../models/userfull';
import {EStorageError} from './errors';
import {TYPES} from '../../di/types';
import {ILogger} from '../../utils/ILogger';


let storage: Array<IUserFullData> = [];

@injectable()
export class MockUserStorage implements IUserStorage {
    @inject(TYPES.Logger) protected readonly _logger: ILogger;

    findOneById(id: string): Promise<TUserStorageGet> {
        const user = storage[parseInt(id, 10) - 1];

        if (!user) {
            return Promise.resolve(errorify(EErrors.NOT_FOUND));
        }

        return Promise.resolve(resultify(user));
    }

    insert(model: IUserFullData): Promise<TUserStorageInsert> {
        const id = storage.push(model);
        model._id = id.toString();

        this._logger.log('insert: ', model);

        return Promise.resolve(resultify(model));
    }

    updateByEmail(email: string, model: Partial<IUserFullData>): Promise<TUserStorageUpdate> {
        this._logger.log(storage);
        const id = storage.findIndex((user: IUserFullData) => user.email === email);
        if (id === -1) {
            return Promise.resolve(errorify(EStorageError.NOT_FOUND));
        }

        const toUpdate = storage[id];

        if (model.email) {
            toUpdate.email = model.email;
        }

        if (model.token !== void 0) {
            toUpdate.token = model.token;
        }

        if (model.password) {
            toUpdate.password = model.password;
        }

        if (model.country) {
            toUpdate.country = model.country;
        }

        if (model.age) {
            toUpdate.age = model.age;
        }

        storage[id] = toUpdate;

        this._logger.log('updateByEmail new Model', toUpdate);

        return Promise.resolve(resultify({...toUpdate}));
    }

    findOneByEmail(email: string): Promise<TUserStorageGet> {
        const id = storage.findIndex((user: IUserFullData) => user.email === email);
        if (id === -1) {
            return Promise.resolve(errorify(EStorageError.NOT_FOUND));
        }

        let model = storage[id];
        model._id = id.toString();

        this._logger.log('FindOneByEmail Model', model);

        return Promise.resolve(resultify(model));
    }
}
