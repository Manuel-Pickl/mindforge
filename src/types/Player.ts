import { getRandomAvatar } from "../services/AvatarManager";
import { Avatar } from "./Avatar";

export class Player {
    username: string;
    isHost: boolean;
    prepareFinished: boolean;
    playRoundFinished: boolean;
    avatar: Avatar;

    constructor(
        aUsername: string,
        aIsHost: boolean,
        aPrepareFinished: boolean = false,
        aPlayRoundFinished: boolean = false,
        aAvatar: Avatar = getRandomAvatar())
    {
        this.username = aUsername;
        this.isHost = aIsHost;
        this.prepareFinished = aPrepareFinished;
        this.playRoundFinished = aPlayRoundFinished;
        this.avatar = aAvatar;
    }
}