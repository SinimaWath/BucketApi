import {interfaces} from 'inversify-express-utils';
import {inject, injectable} from 'inversify';
import {TYPES} from '../../di/types';
import {ILogger} from '../../utils/ILogger';
import {IError} from '../../utils/errors';
import {IAuthData} from '../../models/auth';

@injectable()
export class AuthPrincipal implements interfaces.Principal {
    @inject(TYPES.Logger) private readonly _logger: ILogger;

    public constructor(public details: IAuthData, public error: IError<string>) {}

    public isAuthenticated(): Promise<boolean> {
        if (this.error && this.error.error) {
            return Promise.resolve(false);
        }

        return Promise.resolve(true);
    }
    public isResourceOwner(resourceId: any): Promise<boolean> {
        return void 0;
    }
    public isInRole(role: string): Promise<boolean> {
        return void 0;
    }
}
