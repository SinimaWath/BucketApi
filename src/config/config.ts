import config from './config.json';
// @ts-ignore
import secretKey from './secretKey.json';
import {TPrivateKeyJWT} from '../utils/IJWT';

export interface IConfig {
    mode?: TMode;
    port?: number;
    logger?: TLogger;
    morganMode?: TMorganMode;
    privateKey?: TPrivateKeyJWT;
    jwt?: IJWTConfig;
    passwordHashRound?: number;
}

export interface IJWTConfig {
    exp?: number;
}

export type TLogger = 'console';
export enum ELogger {
    CONSOLE = 'console',
}

export type TMorganMode = 'tiny' | 'combined' | 'common';

export type TMode = 'dev' | 'prod' | 'mocks';

export enum EModes {
    DEV = 'dev',
    PROD = 'prod',
    MOCKS = 'mocks',
}

export default function getConfig (mode: TMode): IConfig {
    if (!secretKey || !secretKey.privateKey) {
        throw 'There is no private Key. Generate it: npm run genereate-jwt-key';
    }

    if (!mode) {
        console.warn('Sorry there is no type for config');

        return config.default;
    }

    switch (mode) {
        case EModes.MOCKS:
        case EModes.DEV:
            const configDev = config.dev as IConfig;
            configDev.mode = mode;
            configDev.privateKey = (secretKey as any).privateKey;

            return configDev;
        default:
            console.warn('Unsupported config type: ', mode);

            return {...config.default, mode};
    }
}


