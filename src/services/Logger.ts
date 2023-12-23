const debug: boolean = false;

export function debugLog(message: string) {
    if (!debug) {
        return;
    }
    
    console.log(message);
}