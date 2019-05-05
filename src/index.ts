import 'reflect-metadata';
import {AppContainer} from './di/bootstrap';
import {TYPES} from './di/types';
import {IConfig} from './config/config';
import {ILogger} from './utils/ILogger';
import {build} from './server';

const server = build(AppContainer, AppContainer.get<IConfig>(TYPES.Config));

server.listen(server.get('port'), () => {
    const logger: ILogger = AppContainer.get(TYPES.Logger);
    logger.log('Port: ', server.get('port'));
});

