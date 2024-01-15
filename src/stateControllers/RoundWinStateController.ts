import { States, StateValues } from "../sm/types";
import { BaseStateController } from './baseStateController';
import {GameModelDynamic} from '../model/modelTypes';
import { randomIntFrom } from './../utils/random';
import GameStorage from "../model/GameStorage";
import { Components } from "../model/gameStorageTypes";

class RoundWinStateController extends BaseStateController {
    constructor(model: GameModelDynamic) {
        super(States.ROUND_WIN, model);
    }

    async onEnter() {
        super.onEnter();

        await GameStorage.getComponent(Components.GAME).onResult();

        const currentBalance = this.model.read<number>("balance");
        const currentWin = GameStorage.getResponse()?.result.win!;

        this.model.write("balance",  currentBalance + currentWin);
        this.model.write("win",  currentWin);

        await GameStorage.getComponent(Components.GAME).onWin();

        this.done();
    };
}

export {RoundWinStateController}