import { States, StateValues } from "../sm/types";
import { BaseStateController } from './baseStateController';
import {GameModelDynamic, UpdateHookData} from '../model/modelTypes';
import GameStorage from "../model/GameStorage";
import { Components } from "../model/gameStorageTypes";

class IdleStateController extends BaseStateController {
    constructor(model: GameModelDynamic) {
        super(States.IDLE, model);

        GameStorage.getComponent(Components.UI).registerHook("newRound", () => {
            this.onNewRoundStart();
        });
    }

    onEnter(): void {
        super.onEnter();

        this.model.write("win",  0);
        
        GameStorage.getComponent(Components.GAME).start();
    }

    onNewRoundStart() {
        this.done();
    }
}

export {IdleStateController}