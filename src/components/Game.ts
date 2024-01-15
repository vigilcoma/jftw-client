import { Container, DisplayObject, Graphics, Sprite, Text, TextStyle, ColorMatrixFilter, AlphaFilter } from "pixi.js";
import Model from './../model/Model';
import GameStorage from "../model/GameStorage";
import { GameLayers } from '../scene/types';
import { Hooks } from '../utils/hooks';
import { UpdateHookData } from "../model/modelTypes";
import { States } from "../sm/types";
import { randomFloatFrom, randomIntFrom } from "../utils/random";

type SymbolData = {
    selected: boolean,
    view: Sprite,
    id: number
}

class Game extends Hooks {
    gameContainer: Container;
    symbolsContainer: Container;
    assetsContainer: Container;
    textContainer: Container;
    resultContainer: Container;

    symbols: SymbolData[] = new Array(9);

    mysterySymbol: Sprite | null = null;

    itemsAmount = 9;
    maxSelectedItems = 5;
    currentSelectedItems = 0;
    
    symbolsBoxWidth = 900;
    symbolsBoxHeight = 300;

    selectFilter: ColorMatrixFilter | null = null;
    alphaFilter: AlphaFilter | null = null;

    

    textStyle = new TextStyle({
        fontSize: 20,
        fill: '#ffffff'
    });
    selectedValue: Text;

    constructor() {
        super();

        const rootStageMap = GameStorage.getRootStageMap();
        this.gameContainer = rootStageMap.get(GameLayers.SCENE);

        this.symbolsContainer = new Container();
        this.resultContainer = new Container();
        this.assetsContainer = new Container();
        this.textContainer = new Container();

        this.selectedValue = new Text("", this.textStyle);
    }

    init() {
        this.gameContainer.addChild(this.symbolsContainer as DisplayObject);
        this.gameContainer.addChild(this.assetsContainer as DisplayObject);
        this.gameContainer.addChild(this.textContainer as DisplayObject);
        this.gameContainer.addChild(this.resultContainer as DisplayObject);

        for (let i = 0; i < 9; i++) {
            const symSprite = Sprite.from(GameStorage.getAsset(`sym${i+1}`));
            
            this.symbols[i] = {
                selected: false,
                view: symSprite,
                id: i
            }
        }

        const selectedText = new Text('Selected:', this.textStyle);
        selectedText.x = 10;
        selectedText.y = 500;

        this.selectedValue.x = selectedText.x + selectedText.width + 5;
        this.selectedValue.y = selectedText.y;

        this.mysterySymbol = Sprite.from(GameStorage.getAsset('mystery'));
        this.mysterySymbol.x = GameStorage.getGameConfig()!.width/2;
        this.mysterySymbol.y = 50;

        this.textContainer.addChild(selectedText as DisplayObject);
        this.textContainer.addChild(this.selectedValue as DisplayObject);

        this.selectFilter = new ColorMatrixFilter();
        this.selectFilter.predator(5, false);

        this.alphaFilter = new AlphaFilter(0.3);
    }

    start() {
        for (let i = 0; i < this.itemsAmount; i++) {
            const sprite = this.symbols[i].view;

            this.symbolsContainer.addChild(sprite as DisplayObject);
            
            const scale = 0.4 + 0.1*Math.random();
            sprite.scale = {x: scale, y: scale};

            sprite.x = i * this.symbolsBoxWidth / (this.itemsAmount - 1) + (GameStorage.getGameConfig()!.width - this.symbolsBoxWidth)/2 + randomIntFrom(-20, 20) - sprite.width/2;
            sprite.y = GameStorage.getGameConfig()!.height/2 + randomIntFrom(-100, 100) - sprite.height/2;
            sprite.rotation = randomFloatFrom(-0.1, 0.1);

            this.symbols[i].selected = false;

            sprite.on('click', (event) => { 
                this.clickOnItem(i);
            });
            sprite.eventMode = 'static';
            sprite.cursor = 'pointer';
        }

        this.currentSelectedItems = 0;

        this.updateSeletedModel();

        this.updateSeletedText();
    }

    submit() {
        this.disableAllSymbols();
        
        this.assetsContainer.addChild(this.mysterySymbol! as DisplayObject);
    }

    async onResult() {
        await this.showresult();
    }

    async onWin() {
        const winSprite = Sprite.from(GameStorage.getAsset('win'));
        winSprite.x = (GameStorage.getGameConfig()!.width - winSprite.width)/2;
        winSprite.y = (GameStorage.getGameConfig()!.height - winSprite.height)/2;

        this.resultContainer.addChild(winSprite as DisplayObject);

        await new Promise((res) => {
            setTimeout(res, 2000);
        });
    }

    async onLose() {
        const loseSprite = Sprite.from(GameStorage.getAsset('lose'));
        loseSprite.x = (GameStorage.getGameConfig()!.width - loseSprite.width)/2;
        loseSprite.y = this.mysterySymbol!.y + this.mysterySymbol!.height/2;

        this.resultContainer.addChild(loseSprite as DisplayObject);

        await new Promise((res) => {
            setTimeout(res, 2000);
        });
    }

    end() {
        for (let i = 0; i < this.itemsAmount; i++) {
            const sprite = this.symbols[i].view;
            sprite.filters = [];
            
            sprite.off('click');
        }

        this.symbolsContainer.removeChildren();
        this.resultContainer.removeChildren();
        this.assetsContainer.removeChildren();

        this.currentSelectedItems = 0;
        this.updateSeletedText();
    }

    private async showresult() {
        const randomQueue: any[] = [];
        const winSymbol: number = GameStorage.getResponse()?.result.symbol!;

        for (let i = 1; i <= this.itemsAmount; i++) {
            if(i != winSymbol) {
                randomQueue.push({
                    delay: randomIntFrom(1, 1000),
                    id: i
                });
            }
        }

        for (let i = 0; i < randomQueue.length; i++) {
            setTimeout(() => {
                const exFilters = this.symbols[randomQueue[i].id - 1].view.filters || [];
                this.symbols[randomQueue[i].id - 1].view.filters = [...exFilters, this.alphaFilter!];
            }, randomQueue[i].delay);
        }

        setTimeout(() => {
            this.assetsContainer.removeChild(this.mysterySymbol as DisplayObject);

            const winSymbolSprite: Sprite = Sprite.from(GameStorage.getAsset(`sym${winSymbol}`));
            winSymbolSprite.scale = {x:0.5, y:0.5};
            winSymbolSprite.x = GameStorage.getGameConfig()!.width/2 - winSymbolSprite.width/2;
            winSymbolSprite.y = 50;

            this.assetsContainer.addChild(winSymbolSprite as DisplayObject);

        }, 1000)

        return new Promise<void>((res, rej) => {
            setTimeout(() => {
                this.assetsContainer.removeChildren();
                res();
            }, 2000);
        });
    }

    private clickOnItem(i: number) {
        if(this.symbols[i].selected) {
            this.symbols[i].selected = false;
            this.currentSelectedItems--;
            this.symbols[i].view.filters = [];
        } else {
            if(this.currentSelectedItems >= 5) {
                return;
            }
            this.currentSelectedItems++;
            this.symbols[i].selected = true;
            this.symbols[i].view.filters = [this.selectFilter!];
        }

        this.updateSeletedModel();

        this.updateSeletedText();
    }


    private disableAllSymbols() {
        for (let i = 0; i < this.itemsAmount; i++) {
            const sprite = this.symbols[i].view;
            sprite.off('click');
            sprite.cursor = "";
        }
    }

    private updateSeletedText() {
        this.selectedValue.text = `${this.currentSelectedItems} out of ${this.maxSelectedItems}`;
    }

    private updateSeletedModel() {
        Model.write<number>("selectedSymbolsAmount", this.currentSelectedItems);
        Model.write<number[]>("selectedSymbolIds", this.symbols.reduce((acc: number[], data: SymbolData) => {
            if(data.selected) {
                acc.push(data.id + 1);
            }
            return acc;
        }, []));
    }
}

export {
    Game
}