export class Player {
    username: string;
    prepareFinished: boolean;
    playRoundFinished: boolean;

    constructor(
        username: string,
        prepareFinished: boolean = false,
        playRoundFinished: boolean = false)
    {
        this.username = username;
        this.prepareFinished = prepareFinished;
        this.playRoundFinished = playRoundFinished;
    }
}