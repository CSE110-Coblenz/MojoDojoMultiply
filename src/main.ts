import Konva from "konva";
import type { Screen, ScreenSwitcher } from "./types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants";

import { StartPageController } from "./StartPageScreen/StartPageController";
import { MainPageController } from "./MainPageScreen/MainPageController";
import { HelpPageController } from "./HelpPageScreen/HelpPageController";
import { PracticeAreaController } from "./PracticeAreaScreen/PracticeAreaController";
import { ResultsScreenController} from "./ResultsPageScreen/ResultsPageController";
import { RoundIntroController } from "./RoundIntroScreen/RoundIntroController";
import { RoundStatsController } from "./RoundStatsScreen/RoundStatsController";
import { BonusLevelController } from "./BonusLevelScreen/BonusLevelController";

class App implements ScreenSwitcher {
  private stage: Konva.Stage;
  private layer: Konva.Layer;

  private startController: StartPageController;
  private mainController: MainPageController;
  private helpController: HelpPageController;
  private practiceController: PracticeAreaController;
  private resultsController: ResultsScreenController;
  private roundIntroController: RoundIntroController;
  private roundStatsController: RoundStatsController;
  private bonusLevelController: BonusLevelController;

  constructor(containerId: string) {
    this.stage = new Konva.Stage({
      container: containerId,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
    });
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    // Controllers create views
    this.startController = new StartPageController(this);
    this.mainController = new MainPageController(this);
    this.helpController = new HelpPageController(this);
    this.practiceController = new PracticeAreaController(this);
    this.resultsController = new ResultsScreenController(this);
    this.roundIntroController = new RoundIntroController(this);
    this.roundStatsController = new RoundStatsController(this, this.layer);
    this.bonusLevelController = new BonusLevelController(this);

    // Add screen groups to same layer
    this.layer.add(this.startController.getView().getGroup());
    this.layer.add(this.mainController.getView().getGroup());
    this.layer.add(this.helpController.getView().getGroup());
    this.layer.add(this.practiceController.getView().getGroup());
    this.layer.add(this.resultsController.getView().getGroup());
    this.layer.add(this.roundIntroController.getView().getGroup());
    //this.layer.add(this.roundStatsController.getView().getGroup());
    this.layer.add(this.bonusLevelController.getView().getGroup());

    this.layer.draw();

    // Start on start screen
    this.startController.show();
  
  }

  switchToScreen(screen: Screen): void {
    this.startController.hide();
    this.mainController.hide();
    this.helpController.hide();
    this.practiceController.hide();
    this.resultsController.hide();
    this.roundIntroController.hide();
    //this.roundStatsController.hide();
    this.bonusLevelController.hide();

    switch (screen.type) {
      case "start": this.startController.show(); break;
      case "main": this.mainController.startGame(); break;
      case "help": 
        this.helpController.gamePrev(screen.fromGame);
        this.helpController.show(); 
        break;
      case "practice": this.practiceController.show(); break;
      case "intro":
        this.roundIntroController.setRound();
        this.roundIntroController.show();
        break;
      case "stats":
        //this.roundStatsController.setRound(screen.round);
        this.roundStatsController.show();
        break;
      case "results":
        this.resultsController.show();
        break;
      case "bonus":
        this.bonusLevelController.show();
        break;
    }
  }
}

new App("root");
