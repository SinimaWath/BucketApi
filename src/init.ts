import './controllers/controllers';

import express from 'express';
import morgan from 'morgan';
import {Container} from 'inversify';
import {ELogger, EModes, IConfig} from './config/config';
import {IUserService} from './services/userService/interfaces';
import {TYPES} from './contsants/types';
import {MockUserService} from './services/userService/userService.mock';
import {Application} from 'express';
import {InversifyExpressServer} from 'inversify-express-utils';
import setEnv from './env';
import {ConsoleLogger, ILogger} from './utils/ILogger';
import {IUserStorage} from './storages/user/interfaces';
import {MockUserStorage} from './storages/user/userStorage.mock';
import {IAuthService} from './services/authService/interfaces';
import {MockAuthService} from './services/authService/authService.mock';

export function initServer(container: Container, config: IConfig): Application {
    const server = new InversifyExpressServer(container);

    server.setConfig(function (app) {
       setEnv(app, config);
       app.use(express.json());
    });

    return server.build();
}

export function initLogger(container: Container, config: IConfig): void {
    container.bind<express.RequestHandler>(TYPES.Morgan).toConstantValue(morgan(config.morganMode));

    switch (config.logger) {
        case ELogger.CONSOLE:
        default:
            container.bind<ILogger>(TYPES.Logger).toConstantValue(new ConsoleLogger());
    }
}

export function initServices(container: Container, config: IConfig): void {
    switch (config.mode) {
        case EModes.MOCKS:
            initMocks(container);
            break;
        default:
            initReal(container);
    }
}

function initMocks(container: Container) {
    container.bind<IAuthService>(TYPES.AuthService).to(MockAuthService).inSingletonScope();
    container.bind<IUserStorage>(TYPES.UserStorage).to(MockUserStorage).inSingletonScope();
    container.bind<IUserService>(TYPES.UserService).to(MockUserService).inSingletonScope();
}

function initReal(container: Container) {

}

