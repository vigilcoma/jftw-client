import { Assets, Text, Container, DisplayObject } from 'pixi.js';
import '../model/GameStorage';
import { States, StateValues } from "../sm/types";
import { BaseStateController } from './baseStateController';
import GameStorage from '../model/GameStorage';
import {GameModelDynamic} from '../model/modelTypes';
import { Components } from '../model/gameStorageTypes';

class LoadStateController extends BaseStateController {
    constructor(model: GameModelDynamic) {
        super(States.LOAD, model);
    }

    async onEnter() {
        super.onEnter();

        GameStorage.getComponent(Components.LOADER).init();

        const delay = new Promise((res, rej) => {
            setTimeout(res, 1000);
        });
        const result = await Promise.all([this.loadGameAssets(), delay]);

        GameStorage.setAssets(result[0]);

        this.done();
    };
    
    async loadGameAssets() {
        const assets = ['background', 'button', 'sym1', 'sym2', 'sym3', 'sym4', 'sym5', 'sym6', 'sym7', 'sym8', 'sym9', 'win', 'lose', "mystery"];
        assets.forEach((item: string) => {
            Assets.add(item, `assets/${item}.png`);
        });

        return Assets.load(assets);
    }

    async onExit() {
        super.onExit();

        GameStorage.getComponent(Components.LOADER).destroy();
    }
}

export {LoadStateController}