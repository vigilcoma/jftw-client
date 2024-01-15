export interface AssetsStorage {
    setAssets: (assets: Record<string, any>) => void;
    getAssets: () => Record<string, any>;
    getAsset: (name: string) => any;
}

export interface ViewStageStorage {
    setRootStage: (stage: any) => void;
    getRootStage: () => any;

    setRootStageMap: (stage: any) => void;
    getRootStageMap: () => any;
}

export interface ServerResponseStorage {
    setResponse: (response: ServerResponse) => void,
    getResponse: () => ServerResponse | null,
}

export interface ConfigStorage {
    setGameConfig: (config: GameConfig) => void,
    getGameConfig: () => GameConfig | null
}

export interface ComponentsStorage {
    setComponent: (componentName: ComponentsValues, component: any) => void;
    getComponent: (componentName: ComponentsValues) => any;
}

export enum Components {
    UI = "UI",
    BACKGROUND = "BACKGROUND",
    LOADER = "LOADER",
    GAME = "GAME"
}

export type ComponentsValues = `${Components}`;

export type ServerResponse = {
    status: number;
    bet: number;
    result: ResultServerResponse;
}

export type GameConfig = {
    width: number;
    height: number;
}

export type ResultServerResponse = {
    win: number;
    symbol: number;
}