import {Container} from 'inversify';

let _container: Container = null;
export class ContainerStorage {
    static get container(): Container {
        return _container
    }

    static set container(cont: Container) {
        _container = cont;
    }
}
