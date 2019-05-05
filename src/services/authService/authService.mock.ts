import {injectable} from 'inversify';
import {BaseAuthService} from './authServiceBase';
import {
    IAuthService,
    IJWTData,
    TCheckAuthToken,
    TCheckCredentials,
    TCheckTokenTruth,
    TCreateAuthToken,
    TRemoveAuthToken
} from './interfaces';
import {IJWT} from '../../utils/IJWT';
import {IAuthData} from '../../models/auth';

@injectable()
export class MockAuthService extends BaseAuthService implements IAuthService{
    checkAndDecode (jwt: IJWT): Promise<TCheckAuthToken> {
        return undefined;
    }

    checkCredentials (authData: IAuthData): Promise<TCheckCredentials> {
        return undefined;
    }

    checkTokenTruth (jwtData: IJWTData & IJWT): Promise<TCheckTokenTruth> {
        return undefined;
    }

    create (authData: IAuthData): Promise<TCreateAuthToken> {
        return undefined;
    }

    createToken (jwtData: IJWTData): Promise<TCreateAuthToken> {
        return undefined;
    }

    remove (jwt: IJWT): Promise<TRemoveAuthToken> {
        return undefined;
    }
}
