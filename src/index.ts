import 'reflect-metadata';
import getConfig, {TMode} from './config/config';
import {Container} from 'inversify';
import {initLogger, initServer, initServices} from './init';
import {TYPES} from './contsants/types';
import {ILogger} from './utils/ILogger';

let container = new Container();

const config = getConfig(process.env.TYPE as TMode);
initLogger(container, config);
container.get<ILogger>(TYPES.Logger).log('Config:', config);

initServices(container, config);

const server = initServer(container, config);

server.listen(server.get('port'), () => {
    const logger: ILogger = container.get(TYPES.Logger);
    logger.log('Port: ', server.get('port'));
});

