import {interfaces, InversifyExpressServer} from 'inversify-express-utils';
import setEnv from './env';
import {Container} from 'inversify';
import {IConfig} from './config/config';
import {TYPES} from './di/types';

import './controllers/controllers';
import {UserAuthProvider} from './services/authService/authProvider';

export function build(container: Container, config: IConfig) {
    const server = new InversifyExpressServer(
        container,
        null,
        null,
        null,
        UserAuthProvider,
    );

    server.setConfig(function (app) {
        setEnv(app, config);
        app.use(container.get(TYPES.Static));
        app.use(container.get(TYPES.JSON));
    });

    server.setErrorConfig(function (app) {
       app.use(container.get(TYPES.Catch));
    });

    return server.build();
}
