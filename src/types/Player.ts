import { Avatar } from "./Avatar";

export class Player {
    username: string;
    prepareFinished: boolean;
    playRoundFinished: boolean;
    avatar: Avatar;

    constructor(
        username: string,
        prepareFinished: boolean = false,
        playRoundFinished: boolean = false,
        avatar: Avatar = Avatar.Giraffe)
    {
        this.username = username;
        this.prepareFinished = prepareFinished;
        this.playRoundFinished = playRoundFinished;
        this.avatar = avatar;
    }
}