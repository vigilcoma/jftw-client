import { Container, DisplayObject, Graphics, Sprite, Text, TextStyle } from "pixi.js";
import Model from './../model/Model';
import GameStorage from "../model/GameStorage";
import { GameLayers } from '../scene/types';
import { Hooks } from '../utils/hooks';
import { UpdateHookData } from "../model/modelTypes";
import { States } from "../sm/types";

class UI extends Hooks {
    container: Container;
    balanceValue: Text;
    betValue: Text;
    winValue: Text;
    textStyle = new TextStyle({
        fontSize: 20,
        fill: '#ffffff'
    });
    startButton: Sprite | null = null;

    constructor() {
        super();

        this.addHooksDescription(["newRound"]);

        const rootStageMap = GameStorage.getRootStageMap();
        this.container = rootStageMap.get(GameLayers.UI);

        this.balanceValue = new Text("", this.textStyle);
        this.betValue = new Text("", this.textStyle);
        this.winValue = new Text("", this.textStyle);

        Model.registerHook("balance", (data: UpdateHookData<number>) => {   
            this.balanceValue.text = data.current;
            console.log(`balance updated from ${data.prev} to ${data.current}`);
        });

        Model.registerHook("win", (data: UpdateHookData<number>) => {   
            this.winValue.text = data.current;
            console.log(`win updated from ${data.prev} to ${data.current}`);
        });

        Model.registerHook("state", (data: UpdateHookData<string>) => {
            if(data.prev == States.ROUND_CHECK && data.current == States.IDLE) {
                alert("Out of money!");
            }
            
            this.handleStartButtonActivation();
        });

        Model.registerHook("selectedSymbolsAmount", (data: UpdateHookData<number>) => {
            this.handleStartButtonActivation();
        });
    }

    private handleStartButtonActivation() {
        if(this.startButton) {
            const buttonEnabled = Model.read("state") == States.IDLE && Model.read<number>("selectedSymbolsAmount") > 0;

            this.startButton.interactive = buttonEnabled
            this.startButton.alpha = buttonEnabled ? 1 : 0.5;
        }
    }

    init() {
        let bg = new Graphics();
        bg.beginFill(0x000000);
        bg.drawRect(0, 0, GameStorage.config!.width, 100);
        bg.alpha = 0.5;
        bg.x = 0;
        bg.y = (GameStorage.config!.height - bg.height);

        const btnSprite = this.startButton = Sprite.from(GameStorage.getAsset("button"));
        btnSprite.x = (GameStorage.config!.width - btnSprite.width)/2;
        btnSprite.y = (GameStorage.config!.height - btnSprite.height);
        
        const balanceText = new Text('Balance:', this.textStyle);
        balanceText.x = 10;
        balanceText.y = GameStorage.config!.height - balanceText.height - 10;

        const betText = new Text('Bet:', this.textStyle);
        betText.x = GameStorage.config!.width - 100;
        betText.y = balanceText.y;

        const winText = new Text('Win:', this.textStyle);
        winText.x = GameStorage.config!.width/2 + 200;
        winText.y = balanceText.y;

        this.winValue.text = Model.read("win");
        this.winValue.x = winText.x + winText.width + 5;
        this.winValue.y = winText.y;

        this.balanceValue.text = Model.read("balance");
        this.balanceValue.x = balanceText.x + balanceText.width + 5;
        this.balanceValue.y = balanceText.y;

        this.betValue.text = Model.read("bet");
        this.betValue.x = betText.x + betText.width + 5;
        this.betValue.y = balanceText.y;

        this.container.addChild(bg as DisplayObject);
        this.container.addChild(btnSprite as DisplayObject);
        this.container.addChild(balanceText as DisplayObject);
        this.container.addChild(this.balanceValue as DisplayObject);
        this.container.addChild(betText as DisplayObject);
        this.container.addChild(winText as DisplayObject);
        this.container.addChild(this.winValue as DisplayObject);
        this.container.addChild(this.betValue as DisplayObject);

        btnSprite.on('click', (event) => { 
            this.startNewRound();
        });
        btnSprite.eventMode = 'static';
        btnSprite.cursor = 'pointer';
    }

    private startNewRound() {
        this.callHook("newRound");
    }
}

export {
    UI
}