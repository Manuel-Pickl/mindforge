export class Player {
    username: string;
    isReady: boolean;

    constructor(username: string, isReady: boolean = false) {
        this.username = username;
        this.isReady = isReady;
    }
}