export type UpdateHookData<V> = {
    prev: V,
    current: V
}
export const GameModelDynamicFields = ["balance", "state", "bet", "selectedSymbolIds", "selectedSymbolsAmount", "win"] as const;
export type GameModelDynamicFieldsType = typeof GameModelDynamicFields[number];

export interface GameModelDynamic {
    write: <V>(field:GameModelDynamicFieldsType, value:V) => void,
    read: <V>(field:GameModelDynamicFieldsType) => V
}