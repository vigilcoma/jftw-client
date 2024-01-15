import { Container, DisplayObject } from "pixi.js";
import { GameLayers,  GameLayersValues} from './types';

class RootViewScene {
    private gameStage: Container;
    private gameLayout: Map<GameLayersValues, Container> = new Map();

    constructor(stage: Container) {
        this.gameStage = stage;

        this.init();
    }
    
    private init() {
        this.addContainer(GameLayers.LOADER);
        this.addContainer(GameLayers.BACKGROUND);
        this.addContainer(GameLayers.SCENE);
        this.addContainer(GameLayers.UI);
    }

    private addContainer(layer: GameLayersValues) {
        const cnt = new Container();
        this.gameLayout.set(layer, cnt);

        this.gameStage.addChild(cnt as DisplayObject);
    }

    getGameLayoutMap() {
        return this.gameLayout;
    }
}

export {
    RootViewScene
}