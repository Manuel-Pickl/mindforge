const debug: boolean = true;

export function debugLog(message: string) {
    if (!debug) {
        return;
    }
    
    console.log(message);
}