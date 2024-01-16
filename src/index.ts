import './style.css';
import { Assets, Sprite, Application, DisplayObject } from 'pixi.js';
import StateMachine from './sm/StateMachine';
import { RoundLoseStateController} from './stateControllers/RoundLoseStateController';
import { RoundWinStateController} from './stateControllers/RoundWinStateController';
import { RoundCheckStateController} from './stateControllers/RoundCheckStateController';
import { RoundResultStateController} from './stateControllers/RoundResultStateController';
import { RoundEndStateController} from './stateControllers/RoundEndStateController';
import { RoundStartStateController} from './stateControllers/RoundStartStateController';
import { IdleStateController} from './stateControllers/IdleStateController';
import { LoadStateController} from './stateControllers/LoadStateController';
import { PrepareStateController} from './stateControllers/PrepareStateController';
import { InitStateController} from './stateControllers/InitStateController';
import { RootViewScene } from './scene/rootViewScene';
import GameStorage from './model/GameStorage';
import Model from './model/Model';
import { UI } from './components/UI';
import { Background } from './components/Background';
import { Loader } from './components/Loader';
import { Game } from './components/Game';
import { Components } from './model/gameStorageTypes';
import { StateGuard, StateValues, States, StatesMap } from './sm/types';

const gameWidth = 1136;
const gameHeight = 640;

const app = new Application({
  backgroundColor: 0xd3d3d3,
  width: gameWidth,
  height: gameHeight,
});

window.onload = async (): Promise<void> => {
  document.body.appendChild(app.view as any);

  GameStorage.setGameConfig({
    width: gameWidth,
    height: gameHeight
  });

  const urlParams = new URLSearchParams(window.location.search);
  const balance = urlParams.get('balance') || 10;
  Model.write("balance", balance);

  const stage = app.stage;
  const rootViewScene = new RootViewScene(stage);
  GameStorage.setRootStage(rootViewScene);
  GameStorage.setRootStageMap(rootViewScene.getGameLayoutMap());

  const ui = new UI();
  GameStorage.setComponent(Components.UI, ui);

  const bg = new Background();
  GameStorage.setComponent(Components.BACKGROUND, bg);

  const laoder = new Loader();
  GameStorage.setComponent(Components.LOADER, laoder);

  const game = new Game();
  GameStorage.setComponent(Components.GAME, game);

  resizeCanvas();

  addStates();
};

function addStates() {
  StateMachine.addStateController(new InitStateController(Model));
  StateMachine.addStateController(new LoadStateController(Model));
  StateMachine.addStateController(new PrepareStateController(Model));
  StateMachine.addStateController(new IdleStateController(Model));
  StateMachine.addStateController(new RoundCheckStateController(Model));
  StateMachine.addStateController(new RoundStartStateController(Model));
  StateMachine.addStateController(new RoundEndStateController(Model));
  StateMachine.addStateController(new RoundResultStateController(Model));
  StateMachine.addStateController(new RoundWinStateController(Model));
  StateMachine.addStateController(new RoundLoseStateController(Model));

  const statesMap: StatesMap = {
    [States.INIT]           : [{state: States.LOAD}],
    [States.LOAD]           : [{state: States.PREPARE}],
    [States.PREPARE]        : [{state: States.IDLE}],
    [States.IDLE]           : [{state: States.ROUND_CHECK}],
    [States.ROUND_CHECK]    : [
      {
        state: States.ROUND_START,
        guard: () => {
          const currentBalance = Model.read<number>("balance");
          const currentBet = Model.read<number>("bet");
          return currentBalance >= currentBet;
        }
      }, 
      {state: States.IDLE}
    ],
    [States.ROUND_START]    : [{state: States.ROUND_RESULT}],
    [States.ROUND_RESULT]   : [
      {
        state: States.ROUND_WIN,
        guard: () => {
          const win = GameStorage.getResponse()?.result.win || 0;
          return win > 0;
        }
      }, 
      {state: States.ROUND_LOSE}
    ],
    [States.ROUND_WIN]      : [{state: States.ROUND_END}],
    [States.ROUND_LOSE]     : [{state: States.ROUND_END}],
    [States.ROUND_END]      : [{state: States.IDLE}]
  }

  StateMachine.start(statesMap);
}

function resizeCanvas(): void {
  const resize = () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);

    const xScale = window.innerWidth / gameWidth;
    const yScale = window.innerHeight / gameHeight;

    const scale = Math.min(xScale, yScale);

    if(scale < 1) {
      app.stage.x = 0;
      app.stage.y = 0;

      app.stage.scale.x = scale;
      app.stage.scale.y = scale;
    } else {
      app.stage.x = (window.innerWidth - gameWidth)/2;
      app.stage.y = 0;

      app.stage.scale.x = 1;
      app.stage.scale.y = 1;
    }
    
  };

  resize();

  window.addEventListener('resize', resize);
}
