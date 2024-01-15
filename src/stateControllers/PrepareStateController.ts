import { Sprite, DisplayObject, Container } from 'pixi.js';
import { States, StateValues } from "../sm/types";
import GameStorage from "../model/GameStorage";
import { BaseStateController } from './baseStateController';
import {GameModelDynamic} from '../model/modelTypes';
import { GameLayers } from '../scene/types';
import { Components } from '../model/gameStorageTypes';

class PrepareStateController extends BaseStateController {
    constructor(model: GameModelDynamic) {
        super(States.PREPARE, model);
    }

    onEnter() {
        super.onEnter();

        GameStorage.getComponent(Components.BACKGROUND).init();
        GameStorage.getComponent(Components.UI).init();
        GameStorage.getComponent(Components.GAME).init();

        this.done();
    };
}

export {PrepareStateController}