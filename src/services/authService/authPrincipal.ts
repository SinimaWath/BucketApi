import {interfaces} from 'inversify-express-utils';
import {injectable} from 'inversify';
import {IJWTData} from './interfaces';
import {IError} from '../../utils/action';

@injectable()
export class AuthPrincipal implements interfaces.Principal {
    public constructor (public details: IJWTData, public error: IError<string>) {}

    public isAuthenticated (): Promise<boolean> {
        if (this.error && this.error.error) {
            return Promise.resolve(false);
        }

        return Promise.resolve(true);
    }
    public isResourceOwner (resourceId: any): Promise<boolean> {
        return void 0;
    }
    public isInRole (role: string): Promise<boolean> {
        return void 0;
    }
}
