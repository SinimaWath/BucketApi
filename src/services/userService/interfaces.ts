export interface IUser {
    email: string;
}

export interface IUserGet {
    id: string;
}

export interface IUserService {
    get(id: string): Promise<IUser>;
}

export interface IUserStorage {
    [id: string]: IUser;
}
