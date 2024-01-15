import { StateValues } from "../sm/types";
import { Hooks } from "../utils/hooks";
import { GameModelDynamic, GameModelDynamicFields, GameModelDynamicFieldsType, UpdateHookData } from "./modelTypes";

class Model extends Hooks implements GameModelDynamic {
    private balance: number = 10;
    private bet: number = 1;
    private win: number = 0;
    private state: StateValues | null = null;

    constructor() {
        super();
        this.addHooksDescription(GameModelDynamicFields.flat());
    }

    write<V>(field: GameModelDynamicFieldsType, value: V) {
        const prevValue = (this as any)[field];
        (this as any)[field] = value;

        this.callHook(field, {
            prev: prevValue,
            current: value
        } as UpdateHookData<V>);
    }

    read<V>(field: GameModelDynamicFieldsType): V {
        return (this as any)[field];
    };
}

export default new Model();