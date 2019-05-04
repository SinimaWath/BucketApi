import {IJWT} from '../../utils/IJWT';

export interface IAuthData {
    _id: string
    email: string;
}

export interface IAuthStorage {
    [id: string]: IAuthData;
}

export interface IAuthService {
    create(authData: IAuthData): Promise<IJWT>;
}
