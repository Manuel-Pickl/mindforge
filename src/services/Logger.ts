import { debug } from "../Settings";

export function debugLog(message: string) {
    if (!debug) {
        return;
    }
    
    console.log(message);
}