import { States, StateValues } from "../sm/types";
import { BaseStateController } from './baseStateController';
import {GameModelDynamic} from '../model/modelTypes';
import GameStorage from "../model/GameStorage";

class RoundResultStateController extends BaseStateController {
    constructor(model: GameModelDynamic) {
        super(States.ROUND_RESULT, model);
    }

    onEnter() {
        super.onEnter();

        this.done();
    };
}

export {RoundResultStateController}