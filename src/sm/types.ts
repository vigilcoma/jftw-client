enum States {
    INIT = "INIT",
    LOAD = "LOAD",
    PREPARE = "PREPARE",
    IDLE = "IDLE",
    ROUND_CHECK = "ROUND_CHECK",
    ROUND_START = "ROUND_START",
    ROUND_RESULT = "ROUND_RESULT",
    ROUND_WIN = "ROUND_WIN",
    ROUND_LOSE = "ROUND_LOSE",
    ROUND_END = "ROUND_END"
}

type StateValues = `${States}`;

type StateGuard = {
    state: StateValues,
    guard?: () => boolean
}

type StatesMap = Partial<Record<States, StateGuard[]>>;

interface StateController {
    name: States,
    onEnter: () => void,
    done: () => void,
    onExit: () => Promise<void>
}

export {
    States,
    StateGuard,
    StatesMap,
    StateValues,
    StateController
}