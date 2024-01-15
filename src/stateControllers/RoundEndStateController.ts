import { States, StateValues } from "../sm/types";
import { BaseStateController } from './baseStateController';
import {GameModelDynamic} from '../model/modelTypes';
import GameStorage from "../model/GameStorage";
import { Components } from "../model/gameStorageTypes";

class RoundEndStateController extends BaseStateController {
    constructor(model: GameModelDynamic) {
        super(States.ROUND_END, model);
    }

    onEnter() {
        super.onEnter();

        GameStorage.getComponent(Components.GAME).end();
        this.done();
    };
}

export {RoundEndStateController}