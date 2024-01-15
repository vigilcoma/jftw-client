import { Container, DisplayObject, Graphics, Text } from "pixi.js";
import GameStorage from "../model/GameStorage";
import { GameLayers } from '../scene/types';

class Loader {
    container: Container;

    constructor() {
        const rootStageMap = GameStorage.getRootStageMap();
        this.container = rootStageMap.get(GameLayers.LOADER);
    }

    init() {
        let bg = new Graphics();
        bg.beginFill(0x00ffff);
        bg.drawRect(0, 0, GameStorage.config!.width, GameStorage.config!.height);

        const loaderText = new Text('Loading...');
        loaderText.x = (GameStorage.config!.width - loaderText.width) / 2;
        loaderText.y = GameStorage.config!.height/2;

        this.container.addChild(bg as DisplayObject);
        this.container.addChild(loaderText as DisplayObject);
    }

    destroy() {
        this.container.removeChildren();
        this.container.visible = false;
    }
}

export {
    Loader
}