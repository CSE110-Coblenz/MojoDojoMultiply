import { ScreenController, type ScreenSwitcher } from "../types";
import { BonusRoundIntroView } from "./BonusIntroView";
import { BonusRoundIntroModel } from "./BonusIntroModel";
import { GAMECST } from "../constants";
import { getGlobalState, saveGlobalState, clearGlobalState, GlobalState } from "../storageManager"

export class BonusIntroController extends ScreenController {
  private screenSwitcher: ScreenSwitcher;
  private view: BonusRoundIntroView;
  private model: BonusRoundIntroModel;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.model = new BonusRoundIntroModel();

    this.view = new BonusRoundIntroView(
      () => this.startBonus(),
      () => this.skipBonus(),
      () => this.handleHoverStart(),
      () => this.handleHoverEnd(),
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
  
  // /**
  //  * 
  //  * 
  //  */
  // setRound() {
  //   this.view.setRound(`Round ${this.model.currentRound}`); 
  // }  
  
  /**
   * Takes the user to the main game and starts gameplay when the start button is pressed
   */
  private startBonus() {
    this.screenSwitcher.switchToScreen({type: "bonus"});
  }

  /**
   * Takes the user back to the start page when the main menu button is pressed
   */
  private skipBonus() {
    //increment round num thats in the save system
    // const savedState = getGlobalState();
    // savedState.currentRound++;
    // saveGlobalState(savedState);


    this.screenSwitcher.switchToScreen({type: "intro"});
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
  getView(): BonusRoundIntroView { return this.view; }
}