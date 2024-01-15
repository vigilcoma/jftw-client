import StateMachine from "../sm/StateMachine";
import { StateController, States } from "../sm/types";
import {GameModelDynamic} from '../model/modelTypes';

class BaseStateController implements StateController {
    readonly stateName: States;
    protected model: GameModelDynamic;

    constructor(state: States, model: GameModelDynamic) {
        this.stateName = state;
        this.model = model;
        
        console.log(`The new StateController created: ${state}`);
    }

    onEnter() {
        console.log(`%c >> Entering state: ${this.stateName}`, 'background: #222; color: #bada55');
    };

    done() {
        StateMachine.next();
    }
    
    async onExit() {
        console.log(`%c << Leaving state: ${this.stateName}`, 'background: #222; color: #ff337d');
    };

    get name(): States {
        return this.stateName
    }
}

export {BaseStateController};