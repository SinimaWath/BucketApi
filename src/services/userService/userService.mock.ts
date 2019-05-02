import {injectable} from 'inversify';
import {IUser, IUserService, IUserStorage} from './interfaces';

const storage: IUserStorage = {
    '1': {
        email: 'test@kek,ru',
    },
};

@injectable()
export class MockUserService implements IUserService{
    get(id: string): Promise<IUser> {
        const user = storage[id];

        if (!user) {
           return Promise.resolve(null);
        }

        return Promise.resolve(user);
    }
}
