import {ErrorRequestHandler} from 'express';
import {EErrors} from '../controllers/errors';
import {AppContainer} from '../di/bootstrap';
import {TYPES} from '../di/types';
import {ILogger} from '../utils/ILogger';
import {NextFunction, Request, Response} from 'express-serve-static-core';
import {errorify} from '../utils/action';

export const catchMiddleware: ErrorRequestHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
): any =>  {
    AppContainer.get<ILogger>(TYPES.Logger).log('catch internal: ', err);

    res.json(errorify(EErrors.INTERNAL)).status(500);
};
