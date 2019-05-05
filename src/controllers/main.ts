import {BaseHttpController, controller, httpGet} from 'inversify-express-utils';

@controller('/')
export class Main extends BaseHttpController {
    /**
     * @api {get} / Hello world
     * @apiGroup Root
     */
    @httpGet('/')
    public get() {
        return this.ok('Hello world');
    }
}
