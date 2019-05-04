import {IAuthData, IAuthService} from './interfaces';
import {inject, injectable} from 'inversify';
import {TYPES} from '../../contsants/types';
import {ILogger} from '../../utils/ILogger';
import {IJWT} from '../../utils/IJWT';

@injectable()
export class MockAuthService implements IAuthService {
    @inject(TYPES.Logger) private readonly _logger: ILogger;

    create(authData: IAuthData): Promise<IJWT> {
        this._logger.log('Not implemented yet');

        return Promise.resolve({jwt: 'Not implemented yet'});
    }

}
