import { AssetsStorage, ComponentsStorage, ComponentsValues, ConfigStorage, ServerResponse, GameConfig, ServerResponseStorage, ViewStageStorage } from "./gameStorageTypes";

class GameStorage implements AssetsStorage, ViewStageStorage, ComponentsStorage, ServerResponseStorage, ConfigStorage {
    assets: Record<string, any> = {};
    stage: any;
    stageMap: any;
    componentsMap: Map<ComponentsValues, any> = new Map();
    response: ServerResponse | null = null;
    config: GameConfig | null = null;

    setAssets(assets: Record<string, any>) {
        this.assets = assets;
    }

    getAssets() {
        return this.assets;
    }

    getAsset(name: string) {
        return this.assets[name];
    }

    setComponent(componentName: ComponentsValues, component: any) {
        this.componentsMap.set(componentName, component);
    }

    getComponent(componentName: ComponentsValues) {
        return this.componentsMap.get(componentName);
    }

    setRootStage(stage: any) {
        this.stage = stage;
    };

    setRootStageMap(stage: any) {
        this.stageMap = stage;
    };

    getRootStage() {
        return this.stage;
    };

    getRootStageMap() {
        return this.stageMap;
    };

    setResponse(response: ServerResponse) {
        this.response = response;
    };

    getResponse() {
        return this.response;
    };

    setGameConfig(config: GameConfig) {
        this.config = config;
    };

    getGameConfig() {
        return this.config;
    };
}

export default new GameStorage();