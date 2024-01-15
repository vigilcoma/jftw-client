import Model from "../model/Model";
import { StateController, StatesMap, StateValues, States, StateGuard } from "./types";

class StateMachine {
    private currentState: StateValues = States.INIT;
    private currentStateController: StateController | null = null;

    private stateControllers: Map<StateValues, StateController>;

    private statesMap: StatesMap = {};

    constructor() {
        this.stateControllers = new Map();
    }

    addStateController(controller: StateController) {
        if(this.stateControllers.has(controller.name)) {
            console.error(`The '${controller.name}' state controller has been added already!`);
        } else {
            this.stateControllers.set(controller.name, controller);
        }
    }

    start(gmaeStatesMap: StatesMap) {
        this.statesMap = gmaeStatesMap;

        this.enterNext();
    }

    private enterNext() {
        if(this.stateControllers.has(this.currentState)) {
            this.currentStateController = this.stateControllers.get(this.currentState)!;
            Model.write<string>("state", this.currentState);
            this.currentStateController.onEnter();
        } else {
            this.currentStateController = null;
            console.error(`State controller is absent: ${this.currentState}`);

            this.next();
        }
    }

    async next() {
        this.currentStateController && await this.currentStateController.onExit();

        const transitions = this.statesMap[this.currentState]!;
        let nextState: StateValues | null = null;

        for (let i = 0; i < transitions.length; i++) {
            const transition: StateGuard = transitions[i];

            if(!transition.guard || transition.guard()) {
                nextState = transition.state;
                break;
            }
        }

        if(nextState) {
            this.currentState = nextState;
            this.enterNext();
        } else {
            console.error(`We are stucked! There is no next state for ${this.currentState}`);
        }
    }
}

export default new StateMachine();
