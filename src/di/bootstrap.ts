import {Container} from 'inversify';
import getConfig, {ELogger, IConfig, TMode} from '../config/config';
import {TYPES} from './types';
import {ConsoleLogger, ILogger} from '../utils/ILogger';
import express from 'express';
import morgan from 'morgan';
import jsonwebtoken from 'jsonwebtoken';
import {IAuthService} from '../services/authService/interfaces';
import {IUserStorage} from '../storages/user/interfaces';
import {MockUserStorage} from '../storages/user/userStorage.mock';
import {IUserService} from '../services/userService/interfaces';
import {JsonWebToken} from './interfaces';
import {TPrivateKeyJWT} from '../utils/IJWT';
import {catchMiddleware} from '../middleware/catch';
import {AuthService} from '../services/authService/authService';
import {UserService} from '../services/userService/userService';

function create (): Container {
    let container = new Container();

    const config = getConfig(process.env.TYPE as TMode);
    container.bind<IConfig>(TYPES.Config).toConstantValue(config);

    initLogger(container, config);
    initServices(container, config);
    initMiddleware(container, config);
    initStorages(container, config);
    initThirdParty(container);
    initConstants(container, config);

    container.get<ILogger>(TYPES.Logger).log('Config:', config);

    return container;
}

function initConstants (container: Container, config: IConfig): void {
    container.bind<TPrivateKeyJWT>(TYPES.PrivateKeyJWT).toConstantValue(config.privateKey);
}

function initThirdParty (container: Container): void {
    container.bind<JsonWebToken>(TYPES.JsonWebToken).toConstantValue(jsonwebtoken);
}

function initMiddleware (container: Container,config: IConfig): void {
    container.bind<express.RequestHandler>(TYPES.Morgan).toConstantValue(morgan(config.morganMode));
    container.bind<express.RequestHandler>(TYPES.JSON).toConstantValue(express.json());
    container.bind<express.RequestHandler>(TYPES.Static).toConstantValue(express.static('public'));
    container.bind<express.ErrorRequestHandler>(TYPES.Catch).toConstantValue(catchMiddleware);

}

function initLogger (container: Container, config: IConfig): void {
    switch (config.logger) {
        case ELogger.CONSOLE:
        default:
            container.bind<ILogger>(TYPES.Logger).toConstantValue(new ConsoleLogger());
    }
}

export function initStorages (container: Container, config: IConfig): void {
    switch (config.mode) {
        default:
            container.bind<IUserStorage>(TYPES.UserStorage).to(MockUserStorage).inSingletonScope();
    }
}

export function initServices (container: Container, config: IConfig): void {
    switch (config.mode) {
        default:
            initRealServices(container);
    }
}

// function initMocksServices(container: Container) {
//     container.bind<IAuthService>(TYPES.AuthService).to(MockAuthService).inSingletonScope();
//     container.bind<IUserService>(TYPES.UserService).to(MockUserService).inSingletonScope();
// }

function initRealServices (container: Container) {
    container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
    container.bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
}

const AppContainer: Container = create();

export {AppContainer};
