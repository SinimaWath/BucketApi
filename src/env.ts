import {IConfig} from './config/config';
import {IApplicationEnv} from './utils/IApplication';

export default function setEnv (app: IApplicationEnv, config: IConfig) {
    app.set('port', config.port);
}
