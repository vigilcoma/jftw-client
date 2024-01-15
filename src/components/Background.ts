import { Container, DisplayObject, Graphics, Sprite } from "pixi.js";
import Model from './../model/Model';
import GameStorage from "../model/GameStorage";
import { GameLayers } from '../scene/types';

class Background {
    container: Container;

    constructor() {
        const rootStageMap = GameStorage.getRootStageMap();
        this.container = rootStageMap.get(GameLayers.BACKGROUND);
    }

    init() {
        const backgroundSprite = Sprite.from(GameStorage.getAsset("background"));
        this.container.addChild(backgroundSprite as DisplayObject);
    }
}

export {
    Background
}