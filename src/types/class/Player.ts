import { getRandomAvatar } from "../../services/AvatarManager";

export class Player {
    username: string;
    isHost: boolean;
    prepareFinished: boolean;
    playRoundFinished: boolean;
    avatar: string;

    constructor(
        aUsername: string,
        aIsHost: boolean,
        aPrepareFinished: boolean = false,
        aPlayRoundFinished: boolean = false,
        aAvatar: string = getRandomAvatar())
    {
        this.username = aUsername;
        this.isHost = aIsHost;
        this.prepareFinished = aPrepareFinished;
        this.playRoundFinished = aPlayRoundFinished;
        this.avatar = aAvatar;
    }
}