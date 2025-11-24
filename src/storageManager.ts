import { GAMECST } from "./constants";

export interface GlobalState {
    currentRound: number;
    totalScore: number;
}

const DEFAULT_STATE: GlobalState = { 
    currentRound: 1, 
    totalScore: 0
};

/**
 * function to load important game data from JSON
 * @returns reference to instance of data storage object with previously saved data
 */
export function getGlobalState(): GlobalState {
    // Get the string data from localStorage
    const jsonString = localStorage.getItem(GAMECST.GLOBAL_DATA_KEY);

    if (jsonString) {
        try {
            // Parse the string back into an object
            return JSON.parse(jsonString) as GlobalState;
        } catch (e) {
            console.error("Error parsing global state, using default.", e);
            // Reset if the stored data is corrupted
            return DEFAULT_STATE; 
        }
    }
    
    // Return default state if nothing is stored
    return DEFAULT_STATE;
}

/**
 * function to save important game data to JSON
 * just saves data form existing instance to JSON
 * @param state reference to instance to save to JSON
 */
export function saveGlobalState(state: GlobalState): void {
    try {
        // 1. Stringify the object into a JSON string
        const jsonString = JSON.stringify(state);
        // 2. Save the string to localStorage
        localStorage.setItem(GAMECST.GLOBAL_DATA_KEY, jsonString);
        // 3. Trigger a refresh in tabs listening for storage changes
        window.dispatchEvent(new StorageEvent('storage', {
            key: GAMECST.GLOBAL_DATA_KEY,
            newValue: jsonString,
            storageArea: localStorage,
        }));
    } catch (e) {
        console.error("Error saving global state.", e);
    }
}

export function clearGlobalState(): void {
    // Removes current save data with key
    localStorage.removeItem(GAMECST.GLOBAL_DATA_KEY);
    
    // override current data with default data
    saveGlobalState(DEFAULT_STATE)

}