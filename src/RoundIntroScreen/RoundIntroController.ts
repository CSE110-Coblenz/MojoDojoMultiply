import { ScreenController, type ScreenSwitcher } from "../types";
import { RoundIntroModel } from "./RoundIntroModel";
import { RoundIntroView } from "./RoundIntroView";
import { GAMECST } from "../constants";
import { GlobalState } from "../storageManager"

export class RoundIntroController extends ScreenController {
  private screenSwitcher: ScreenSwitcher;
  private view: RoundIntroView;
  private model: RoundIntroModel;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.model = new RoundIntroModel();

    this.view = new RoundIntroView(
      () => this.startRound(),
      () => this.returnStartPage(),
      () => this.handleHoverStart(),
      () => this.handleHoverEnd()
    )

    this.setupGlobalStateListener();
  }

  setupGlobalStateListener(): void {
          // Listen for changes made by other windows (automatic updates when saving)
          window.addEventListener('storage', (event: StorageEvent) => {
              // Check if the change was made to the same key
              if (event.key === GAMECST.GLOBAL_DATA_KEY) {
                  // event.newValue holds the new JSON string
                  if (event.newValue) {
                      try {
                          const newState = JSON.parse(event.newValue) as GlobalState;
                          
                          // Update data with loaded data from JSON
                          this.model.currentRound=newState.currentRound;
                          
                      } catch (e) {
                          console.error("Failed to parse storage update:", e);
                      }
                  }
              }
          });
      }
  
  //TODO: double check where this is used -Richard
  /**
   * 
   * 
   */
  setRound() {
    this.view.setRound(`Round ${this.model.currentRound}`); 
  }  
  
  /**
   * Takes the user to the main game and starts gameplay when the start button is pressed
   */
  private startRound() {
    this.screenSwitcher.switchToScreen({type: "main"});
  }

  /**
   * Takes the user back to the start page when the main menu button is pressed
   */
  private returnStartPage() {
    this.screenSwitcher.switchToScreen({type: "start"});
  }

  /**
   * Changes the cursor to a pointer to demostrate clickability when a clickable item is hovered
   */
  private handleHoverStart() {
    document.body.style.cursor = 'pointer';
  }

  /**
   * Changes the pointer back to a cursor when it no longer hovers a clickable element
   */
  private handleHoverEnd() {
    document.body.style.cursor = 'default';
  }

  /**
   * 
   * @returns The view element
   */
  getView(): RoundIntroView { return this.view; }
}