import {inject, injectable} from 'inversify';
import {TYPES} from '../../di/types';
import {JsonWebToken} from '../../di/interfaces';
import {TPrivateKeyJWT} from '../../utils/IJWT';
import {IConfig} from '../../config/config';

@injectable()
export abstract class BaseAuthService {
    @inject(TYPES.JsonWebToken) protected readonly _jwt: JsonWebToken;
    @inject(TYPES.PrivateKeyJWT) protected readonly _secretKey: TPrivateKeyJWT;
    @inject(TYPES.Config) protected readonly _config: IConfig;
}
