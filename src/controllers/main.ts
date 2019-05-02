import {BaseHttpController, controller, httpGet} from 'inversify-express-utils';

@controller('/')
export class Main extends BaseHttpController {
    @httpGet('/')
    public get() {
        return this.ok('Hello world');
    }
}
