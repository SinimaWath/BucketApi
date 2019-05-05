import {injectable} from 'inversify';

export interface ILogger {
    log (...value: any[]): void;
}

@injectable()
export class ConsoleLogger implements ILogger {
    log (...values: any[]): void {
        console.log(...values);
    }
}
