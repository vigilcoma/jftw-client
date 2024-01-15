import { Assets } from 'pixi.js';
import '../model/GameStorage';
import { States, StateValues } from "../sm/types";
import { BaseStateController } from './baseStateController';
import {GameModelDynamic} from '../model/modelTypes';

class InitStateController extends BaseStateController {
    constructor(model: GameModelDynamic) {
        super(States.INIT, model);
    }

    async onEnter() {
        super.onEnter();

        this.done();
    };
}

export {InitStateController}