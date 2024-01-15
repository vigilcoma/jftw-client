import { States, StateValues } from "../sm/types";
import { BaseStateController } from './baseStateController';
import {GameModelDynamic} from '../model/modelTypes';

class RoundCheckStateController extends BaseStateController {
    constructor(model: GameModelDynamic) {
        super(States.ROUND_CHECK, model);
    }

    onEnter(): void {
        super.onEnter();

        this.done();
    }
}

export {RoundCheckStateController}