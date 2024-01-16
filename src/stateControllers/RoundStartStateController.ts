import { States, StateValues } from "../sm/types";
import { BaseStateController } from './baseStateController';
import {GameModelDynamic} from '../model/modelTypes';
import { randomIntFrom } from './../utils/random';
import { Components, ServerResponse } from "../model/gameStorageTypes";
import Model from "../model/Model";
import GameStorage from "../model/GameStorage";

class RoundStartStateController extends BaseStateController {
    constructor(model: GameModelDynamic) {
        super(States.ROUND_START, model);
    }

    onEnter() {
        super.onEnter();

        const currentBalance = this.model.read<number>("balance");
        const currentBet = this.model.read<number>("bet");

        this.model.write("balance",  currentBalance - currentBet);

        this.doRequest();
    };

    doRequest() {
        const selectedSymbols = this.model.read<number[]>("selectedSymbolIds");
        const resultSymbol = randomIntFrom(1,9);

        console.log(`${selectedSymbols} | ${resultSymbol}`);

        const response = {
            status: 200,
            bet: Model.read("bet"),
            result: {
                win: selectedSymbols.includes(resultSymbol) ? 2 : 0,
                symbol: resultSymbol
            }
        } as ServerResponse;

        GameStorage.setResponse(response);

        setTimeout(() => { this.done(); }, randomIntFrom(500, 1000));
    }
}

export {RoundStartStateController}