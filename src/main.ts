import Konva from "konva";
import type { Screen, ScreenSwitcher } from "./types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants";

import { StartPageController } from "./StartPageScreen/StartPageController";
import { MainPageController } from "./MainPageScreen/MainPageController";
import { HelpPageController } from "./HelpPageScreen/HelpPageController";
import { PracticeAreaController } from "./PracticeAreaScreen/PracticeAreaController";

class App implements ScreenSwitcher {
  private stage: Konva.Stage;
  private layer: Konva.Layer;

  private startController: StartPageController;
  private mainController: MainPageController;
  private helpController: HelpPageController;
  private practiceController: PracticeAreaController;

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

    // Add screen groups to same layer
    this.layer.add(this.startController.getView().getGroup());
    this.layer.add(this.mainController.getView().getGroup());
    this.layer.add(this.helpController.getView().getGroup());
    this.layer.add(this.practiceController.getView().getGroup());

    this.layer.draw();

    // Start on start screen
    this.startController.show();
  }

  switchToScreen(screen: Screen): void {
    this.startController.hide();
    this.mainController.hide();
    this.helpController.hide();
    this.practiceController.hide();

    switch (screen.type) {
      case "start": this.startController.show(); break;
      case "main": this.mainController.show(); break;
      case "help": this.helpController.show(); break;
      case "practice": this.practiceController.show(); break;
    }
  }
}

new App("root");
