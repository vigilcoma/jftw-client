import { States, StateValues } from "../sm/types";
import { BaseStateController } from './baseStateController';
import {GameModelDynamic} from '../model/modelTypes';
import { randomIntFrom } from './../utils/random';
import GameStorage from "../model/GameStorage";
import { Components } from "../model/gameStorageTypes";

class RoundLoseStateController extends BaseStateController {
    constructor(model: GameModelDynamic) {
        super(States.ROUND_LOSE, model);
    }

    async onEnter() {
        super.onEnter();

        await GameStorage.getComponent(Components.GAME).onResult();

        this.done();
    };
}

export {RoundLoseStateController} 